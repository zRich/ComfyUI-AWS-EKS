# Create Cluster

```shell
eksctl create cluster --name Comfyui-Cluster --region us-west-2
```

NodeGroup

Create a lanuch template first

eksctl create nodegroup --config-file manifests/Config/eks-nodegroup.yaml