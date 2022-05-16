---
template: post
title: DevStack on VirtualBox Ubuntu 20.04
slug: devstack-ubuntu
socialImage: /media/image-1.jpg
draft: false
date: 2022-03-06T15:57:42.610Z
description: Set up an OpenStack instance on a Ubuntu 20.04 VM in VirtualBox using DevStack
category: Cloud Computing
tags:
  - Cloud Computing
  - OpenStack
  - DevStack
---

This guide installs DevStack on a virtual machine running Ubuntu 20.04, and includes the following OpenStack services:

- Nova (Compute Service)
- Zun (Containers Service)
- Swift (Object Store)
- Cinder (Block Storage)
- Neutron (Networking)
- Keystone (Identity Service)
- Placement (Placement Service)
- Glance (Image Service)
- Heat (Orchestration Service)
- Horizon (Dashboard)

## Prerequisite Installations

- [Oracle VM VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- [Ubuntu 20.04 LTS image](https://ubuntu.com/download/desktop)

## Steps

1. Open VirtualBox and click on "New".
2. Enter a name for the new virtual machine. Select "Linux" for type and "Ubuntu (64-bit)" for version. Tip: Entering in "Ubuntu" for the name will auto-fill the other fields for you.
3. Allocate a sizable amount of memory for the VM - preferably as much as you can. 2048 MB of RAM is good for machines with 8 GB RAM, 4096 MB of RAM is good for machines with 16 GB RAM, 8192MB of RAM is good for machines with 32GB RAM, you get the point.
4. Create a new virtual hard disk - allocate at least 50 GB, or however much you can.
5. Once the VM has been created, click on "Settings". Go to the "Network" tab open the "Advanced" options.
6. Click on "Port Forwarding". You'll want to add one rule here with a protocol of TCP and a guest port of 80 (HTTP port). You can choose whatever name and host port you'd like. This will be used as the port for the OpenStack Horizon dashboard on your host machine later on. Optionally, forward the SSH port (port 22) as well.
7. Start the VM. Hover over the "Devices" menu, select "Optical Drives", and then select "Choose/Create a disk image...". You'll want to select the Ubuntu 20.04 image you downloaded here.
8. Go through the rest of the installation steps in the VM.
9. Once everything has been installed, open the Terminal (shortcut Ctrl+Alt+T).
10. Check if any updates are needed:

```
sudo apt update
sudo apt dist-upgrade --yes
```

11. This step is optional, but enabling a shared clipboard between the host and guest machines will make working with the VM easier. See [Enabling Shared Clipboard](#enabling-shared-clipboard)
12. Add a new `stack` user to run DevStack with and use it:

```
sudo useradd -s /bin/bash -d /opt/stack -m stack
echo "stack ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/stack
sudo su - stack
```

13. Clone the devstack repository and change your working directory to it. In this guide, we'll be using the `xena` release but you may choose any release.

```
git clone https://github.com/openstack-dev/devstack.git -b stable/xena
cd devstack/
```

14. Copy the sample configuration file.

```
cp samples/local.conf .
```

15. Modify it to use the desired `ADMIN_PASSWORD` and `HOST_IP`, as well as enabling services like Swift (object store) or Zun (containers):

```
# The ``localrc`` section replaces the old ``localrc`` configuration file.
# Note that if ``localrc`` is present it will be used in favor of this section.
[[local|localrc]]

# Minimal Contents
# ----------------

# While ``stack.sh`` is happy to run without ``localrc``, devlife is better when
# there are a few minimal variables set:

# If the ``*_PASSWORD`` variables are not set here you will be prompted to enter
# values for them by ``stack.sh``and they will be added to ``local.conf``.
ADMIN_PASSWORD=devstack
DATABASE_PASSWORD=stackdb
RABBIT_PASSWORD=stackqueue
SERVICE_PASSWORD=$ADMIN_PASSWORD

# ``HOST_IP`` and ``HOST_IPV6`` should be set manually for best results if
# the NIC configuration of the host is unusual, i.e. ``eth1`` has the default
# route but ``eth0`` is the public interface.  They are auto-detected in
# ``stack.sh`` but often is indeterminate on later runs due to the IP moving
# from an Ethernet interface to a bridge on the host. Setting it here also
# makes it available for ``openrc`` to include when setting ``OS_AUTH_URL``.
# Neither is set by default.
HOST_IP=10.0.2.15
#HOST_IPV6=2001:db8::7


# Logging
# -------

# By default ``stack.sh`` output only goes to the terminal where it runs.  It can
# be configured to additionally log to a file by setting ``LOGFILE`` to the full
# path of the destination log file.  A timestamp will be appended to the given name.
LOGFILE=$DEST/logs/stack.sh.log

# Old log files are automatically removed after 7 days to keep things neat.  Change
# the number of days by setting ``LOGDAYS``.
LOGDAYS=2

# Nova logs will be colorized if ``SYSLOG`` is not set; turn this off by setting
# ``LOG_COLOR`` false.
#LOG_COLOR=False


# Using milestone-proposed branches
# ---------------------------------

# Uncomment these to grab the milestone-proposed branches from the
# repos:
#CINDER_BRANCH=milestone-proposed
#GLANCE_BRANCH=milestone-proposed
#HORIZON_BRANCH=milestone-proposed
#KEYSTONE_BRANCH=milestone-proposed
#KEYSTONECLIENT_BRANCH=milestone-proposed
#NOVA_BRANCH=milestone-proposed
#NOVACLIENT_BRANCH=milestone-proposed
#NEUTRON_BRANCH=milestone-proposed
#SWIFT_BRANCH=milestone-proposed

# Using git versions of clients
# -----------------------------
# By default clients are installed from pip.  See LIBS_FROM_GIT in
# stackrc for details on getting clients from specific branches or
# revisions.  e.g.
# LIBS_FROM_GIT="python-ironicclient"
# IRONICCLIENT_BRANCH=refs/changes/44/2.../1

# Swift
# -----

# Swift is now used as the back-end for the S3-like object store. Setting the
# hash value is required and you will be prompted for it if Swift is enabled
# so just set it to something already:
SWIFT_HASH=66a3d6b56c1f479c8b4e70ab5c2000f5

# For development purposes the default of 3 replicas is usually not required.
# Set this to 1 to save some resources:
SWIFT_REPLICAS=1

# The data for Swift is stored by default in (``$DEST/data/swift``),
# or (``$DATA_DIR/swift``) if ``DATA_DIR`` has been set, and can be
# moved by setting ``SWIFT_DATA_DIR``. The directory will be created
# if it does not exist.
SWIFT_DATA_DIR=$DEST/data

enable_service s-account s-container s-object s-proxy
enable_plugin zun https://github.com/openstack/zun $TARGET_BRANCH
enable_plugin zun-tempest-plugin https://github.com/openstack/zun-tempest-plugin

# This below plugin enables installation of container engine on Devstack.
# The default container engine is Docker
enable_plugin devstack-plugin-container https://github.com/openstack/devstack-plugin-container $TARGET_BRANCH
# This enables CRI plugin for containerd
ENABLE_CONTAINERD_CRI=True

# Optional:  uncomment to enable Kata Container
# ENABLE_KATA_CONTAINERS=True

# In Kuryr, KURYR_CAPABILITY_SCOPE is `local` by default,
# but we must change it to `global` in the multinode scenario.
KURYR_CAPABILITY_SCOPE=global
KURYR_PROCESS_EXTERNAL_CONNECTIVITY=False
enable_plugin kuryr-libnetwork https://github.com/openstack/kuryr-libnetwork $TARGET_BRANCH

# install python-zunclient from git
LIBS_FROM_GIT="python-zunclient"

# Optional:  uncomment to enable the Zun UI plugin in Horizon
enable_plugin zun-ui https://github.com/openstack/zun-ui $TARGET_BRANCH

# Enable heat services
enable_service h-eng h-api h-api-cfn h-api-cw
# Enable heat plugin
enable_plugin heat https://github.com/openstack/heat $TARGET_BRANCH
```

16. Set the `TARGET_BRANCH` environment variable to the DevStack release that you are using:

```
TARGET_BRANCH=stable/xena
```

17. Run `stack.sh` to install DevStack. This can take a while, so go play some video games or grab a meal while it's installing.

```
./stack.sh
```

18. Once it's complete, you should be able to access the OpenStack Horizon dashboard from your host machine via the IP address listed in the summary (http://192.168.56.101) in the below screenshot). Congrats, you can use OpenStack however you want to now!

![DevStack Results](/media/devstackresult.PNG)

## Enabling Shared Clipboard

1. Hover over the "Devices" menu and select "Shared Clipboard". Select "Bidirectional" to enable copy + pasting between host and guest machines. If this
2. If you're able to copy and paste between machines at this point, you're set. Otherwise, some additional configuration that may be necessary, so follow the next steps.
3. Run `sudo apt install virtualbox-guest-x11` to install VBoxClient.
4. Run `sudo VBoxClient --clipboard` to enable the clipboard
5. You should be able to copy and paste between machines now.

## Viewing Logs

To view logs of the DevStack service, run

`sudo journalctl -f -u devstack@n-api.service`
