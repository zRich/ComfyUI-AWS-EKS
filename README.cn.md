# Stable Diffusion on EKS

## 1. 安装必须软件

基本包

```shell
sudo apt-get update
sudo apt install -y curl g++ libssl-dev openssl cmake git build-essential autoconf texinfo flex patch bison libgmp-dev zlib1g-dev unzip uidmap
```

## 2. Optional 安装 EFS 访问工具

```shell
sudo apt install -y curl g++ libssl-dev openssl cmake git build-essential autoconf texinfo flex patch bison libgmp-dev zlib1g-dev unzip uidmap
sudo apt-get -y install git binutils rustc cargo pkg-config libssl-dev
git clone https://github.com/aws/efs-utils
cd efs-utils
./build-deb.sh
sudo apt-get -y install ./build/amazon-efs-utils*deb
```

Docker

```shell
cd ~
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
dockerd-rootless-setuptool.sh install
 ```

AWS CLI

```shell
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

NVM

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
```

Node

```shell
source ~/.bashrc
nvm install 20 --lts
npm i -g yarn
```

## 配置 AWS 账号

需要用到 AWS Access Key，如果没有先登录到AWS网站创建。

AWS Credentials

```shell
aws configure
```

## 1. 构建镜像

下载 ComfyUI 到 comfyui_image 目录

通过在 Dockerfile 中使用 RUN 命令来安装 custom nodes 和依赖，需要先找到缺失的 custom nodes 的 Github 地址

```shell
export region="us-west-2" # Modify the region to your current region.
cd ~/comfyui-on-eks/comfyui_image/ && bash build_and_push.sh $region Dockerfile
```

## 安装 kubeclt

参考 [官方手册](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html#kubectl-install-update)

```shell
curl -O https://s3.us-west-2.amazonaws.com/amazon-eks/1.29.6/2024-07-12/bin/linux/amd64/kubectl
chmod +x ./kubectl
mkdir -p $HOME/bin && cp ./kubectl $HOME/bin/kubectl && export PATH=$HOME/bin:$PATH
echo 'source <(kubectl completion bash)' >>~/.bashrc
source ~/.bashrc
```

## 安装 eksctl

参考 [官方手册](https://eksctl.io/installation/)

```shell
# for ARM systems, set ARCH to: `arm64`, `armv6` or `armv7`
ARCH=amd64
PLATFORM=$(uname -s)_$ARCH

curl -sLO "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_$PLATFORM.tar.gz"

# (Optional) Verify checksum
curl -sL "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_checksums.txt" | grep $PLATFORM | sha256sum --check

tar -xzf eksctl_$PLATFORM.tar.gz -C /tmp && rm eksctl_$PLATFORM.tar.gz

sudo mv /tmp/eksctl /usr/local/bin
```

自动补全

```shell
. <(eksctl completion bash)
```