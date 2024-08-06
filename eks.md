# Create Cluster

```shell
eksctl create cluster --name Comfyui-Cluster --region us-west-2
```

NodeGroup

Create a lanuch template first

eksctl create nodegroup --config-file manifests/Config/eks-nodegroup.yaml

export cluster_name=Comfyui-Cluster
export role_name=AmazonEKS_EFS_CSI_DriverRole
eksctl create iamserviceaccount \
    --name efs-csi-controller-sa \
    --namespace kube-system \
    --cluster $cluster_name \
    --role-name $role_name \
    --role-only \
    --attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEFSCSIDriverPolicy \
    --approve
TRUST_POLICY=$(aws iam get-role --role-name $role_name --query 'Role.AssumeRolePolicyDocument' | \
    sed -e 's/efs-csi-controller-sa/efs-csi-*/' -e 's/StringEquals/StringLike/')
aws iam update-assume-role-policy --role-name $role_name --policy-document "$TRUST_POLICY"


eksctl delete cluster --name Comfyui-Cluster --region us-west-2
