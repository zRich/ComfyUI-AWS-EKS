
# Prerequirements

```bash
sudo apt-get update
sudo apt install -y curl g++ libssl-dev openssl cmake git build-essential autoconf texinfo flex patch bison libgmp-dev zlib1g-dev
sudo apt-get -y install git binutils rustc cargo pkg-config libssl-dev
git clone https://github.com/aws/efs-utils
cd efs-utils
./build-deb.sh
sudo apt-get -y install ./build/amazon-efs-utils*deb
```

# Create EFS Secrity Group

参考 [官方手册](https://docs.aws.amazon.com/efs/latest/ug/accessing-fs-create-security-groups.html)

You can use the AWS Management Console to create security groups in your VPC. To connect your Amazon EFS file system to your Amazon EC2 instance, you must create two security groups: one for your Amazon EC2 instance and another for your Amazon EFS mount target.

Create two security groups in your VPC. For instructions, see Create a security group in the Amazon VPC User Guide.

In the VPC console, verify the default rules for these security groups. Both security groups should have only an outbound rule that allows traffic to leave.

You must authorize additional access to the security groups as follows:

Add a rule to the EC2 security group to allow SSH access to the instance on port 22 as shown following. This is useful if you're planning on using an SSH client like PuTTY to connect to and administer your EC2 instance through a terminal interface. Optionally, you can restrict the Source address.

For instructions, see Add rules to a security group in the Amazon VPC User Guide.

Add a rule to the mount target security group to allow inbound access from the EC2security group on TCP port 2049. The security group assigned as the Source is the security group associated with the EC2 instance.

To view the security groups associated with your file systems mount targets, in the EFS console, choose the Network tab in the File system details page. For more information, see Managing mount targets.

## Create access points

[Docs](https://docs.aws.amazon.com/efs/latest/ug/create-access-point.html)
[Code](https://github.com/kubernetes-sigs/aws-efs-csi-driver/tree/master/examples/kubernetes/access_points)

## Mount EFS from Ubuntu EC2

```bash
sudo mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport fs-0d91f2f3f42f755f4.efs.us-west-2.amazonaws.com:/ /home/ubuntu/efs
```