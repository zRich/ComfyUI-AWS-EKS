import * as cdk from 'aws-cdk-lib';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { CapacityType, KubernetesVersion, NodegroupAmiType } from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Construct } from "constructs";
import * as blueprints from '@aws-quickstart/eks-blueprints';

const stackName = 'Comfyui-Cluster';

export interface BlueprintConstructProps { id: string }

export default class BlueprintConstruct {
    constructor(scope: Construct, props: cdk.StackProps) {

        // Instance profiles of K8S node EC2
        const nodeRole = new blueprints.CreateRoleProvider("blueprint-node-role", new iam.ServicePrincipal("ec2.amazonaws.com"),
        [
            iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEKS_CNI_Policy"),
            iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEKSWorkerNodePolicy"),
            iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEC2ContainerRegistryReadOnly"),
            iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore"),
            iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
        ]);

        // Add-ons
        const karpenterAddOn = new blueprints.addons.KarpenterAddOn({
            version: 'v0.34.5',
            values: {replicas: 1}
        });
        const addOns: Array<blueprints.ClusterAddOn> = [
            new blueprints.addons.AwsLoadBalancerControllerAddOn(),
            new blueprints.addons.SSMAgentAddOn(),
            karpenterAddOn,
            new blueprints.GpuOperatorAddon({
                values:{
                    driver: {
                      enabled: true
                    },
                    mig: {
                      strategy: 'mixed'
                    },
                    devicePlugin: {
                      enabled: true,
                      version: 'v0.13.0'
                    },
                    migManager: {
                      enabled: true,
                      WITH_REBOOT: true
                    },
                    toolkit: {
                      version: 'v1.13.1-centos7'
                    },
                    operator: {
                      defaultRuntime: 'containerd'
                    },
                    gfd: {
                      version: 'v0.8.0'
                    }
                  }
            }),
        ];

        const clusterProvider = new blueprints.GenericClusterProvider({
            version: KubernetesVersion.V1_29,
            tags: {
                "Name": "comfyui-eks-cluster",
                "Type": "generic-cluster"
            },
            mastersRole: blueprints.getResource(context => {
                return new iam.Role(context.scope, 'AdminRole', { assumedBy: new iam.AccountRootPrincipal() });
            }),
            managedNodeGroups: [
                addLightWeightNodeGroup()
            ]
        });

        blueprints.EksBlueprint.builder()
            .addOns(...addOns)
            .resourceProvider(blueprints.GlobalResources.Vpc, new blueprints.VpcProvider(undefined, {
                primaryCidr: "10.2.0.0/16",
                secondaryCidr: "100.64.0.0/16",
                secondarySubnetCidrs: ["100.64.0.0/24","100.64.1.0/24","100.64.2.0/24"]
            }))
            .resourceProvider("node-role", nodeRole)
            .clusterProvider(clusterProvider)
            .teams()
            .build(scope, stackName, props);
    }
}

// Node Group for lightweight workloads
function addLightWeightNodeGroup(): blueprints.ManagedNodeGroup {
    return {
        id: "AL2-MNG-LW",
        amiType: NodegroupAmiType.AL2_X86_64,
        instanceTypes: [new ec2.InstanceType('t3a.xlarge')],
        nodeRole: blueprints.getNamedResource("node-role") as iam.Role,
        minSize: 1,
        desiredSize: 2,
        maxSize: 5,
        nodeGroupSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
        launchTemplate: {
            tags: {
                "Name": "Comfyui-EKS-LW-Node",
            }
        }
    };
}
