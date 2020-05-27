# 设计原理

## 执行流程
* 在执行机器上生成证书和kubeconfig文件
* 在执行机器上wget下载离线包和sealos二进制使用scp拷贝到目标机器上（masters和nodes）
* 在master0上执行kubeadm init
* 在其它master上执行kubeadm join 并设置控制面，这个过程会在其它master上起etcd并与master0的etcd组成集群，并启动控制组建（apiserver controller等）
* join node节点，会在node上配置ipvs规则，配置/etc/hosts等

有个细节是所有对apiserver进行访问都是通过域名，因为master上连接自己就行，node需要通过虚拟ip链接多个master，这个每个节点的kubelet与kube-proxy访问apiserver的地址是不一样的，而kubeadm又只能在配置文件中指定一个地址，所以使用一个域名但是每个节点解析不同。

使用域名的好处还有就是IP地址发生变化时仅需要修改解析即可。

## 本地内核负载
通过这样的方式实现每个node上通过本地内核负载均衡访问masters：
```
  +----------+                       +---------------+  virturl server: 127.0.0.1:6443
  | mater0   |<----------------------| ipvs nodes    |    real servers:
  +----------+                      |+---------------+            10.103.97.200:6443
                                    |                             10.103.97.201:6443
  +----------+                      |                             10.103.97.202:6443
  | mater1   |<---------------------+
  +----------+                      |
                                    |
  +----------+                      |
  | mater2   |<---------------------+
  +----------+
```
在node上起了一个lvscare的static pod去守护这个 ipvs, 一旦apiserver不可访问了，会自动清理掉所有node上对应的ipvs规则， master恢复正常时添加回来。

所以在你的node上加了三个东西，可以直观的看到：
```sh
cat /etc/kubernetes/manifests   # 这下面增加了lvscare的static pod
ipvsadm -Ln                     # 可以看到创建的ipvs规则
cat /etc/hosts                  # 增加了虚拟IP的地址解析
```

**sealos已经把lvscare本地负载和百年证书已经在sealos中支持，使用起来极其方便！！！**


## 离线包结构分析
```
.
|____docker # docker的离线包
| |____docker.tgz
| |____README.md
|____bin # 指定版本的bin文件
| |____conntrack
| |____kubeadm
| |____kubelet
| |____sealos
| |____kubelet-pre-start.sh
| |____kubectl
| |____crictl
|____images # kubernetes的离线镜像
| |____images.tar
| |____README.md
|____shell # 离线包的部署脚本,sealos会自动调用
| |____master.sh
| |____init.sh
| |____docker.sh
|____README.md
|____conf
| |____net   # 高版本的sealos已经集成
| | |____calico.yaml
| |____10-kubeadm.conf # kubeadm的配置文件
| |____calico.yaml
| |____kubeadm.yaml
| |____kubelet.service
| |____docker.servic
```
init.sh脚本中拷贝bin文件到$PATH下面，配置systemd，关闭swap防火墙等，然后导入集群所需要的镜像。

master.sh主要执行了kubeadm init

conf下面有有我需要的如kubeadm的配置文件，calico yaml文件等等

sealos会调用二者。 所以大部分兼容不同版本都可以微调脚本做到。
