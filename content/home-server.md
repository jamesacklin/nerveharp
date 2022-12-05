---
title: "My home server"
date: "2022-11-24"
summary: "This details my journey into self-hosting, running a server in my basement, and small-scale home networking over the past two and a half years."
---

I started running my own services in June of 2020 after moving into my current house and finally beginning to swear off impersonal, corporate cloud services. I’m happy to detail my exact choices of self-hosted applications in later posts, but this series focuses mostly on the evolution of my approach to home server hardware. My needs center on file storage and access (as opposed to computation or automation).

## External SSD plugged directly into router

My Synology wireless router supports sharing USB devices over the network, such as printers or hard drives. My first venture into basic network services in June 2020 was to plug in a hard drive, turn it on, do some light configuration, and connect to the SMB share from two different computers.

This was probably fine and I likely could have stopped here, but I soon wanted to do more with my home network than share files. The Synology router has enough CPU horsepower to handle high-bandwidth wireless network traffic, but lacks support for the usual self-hosted applications.

I don’t have any pictures of this setup, but I promise it was unremarkable and tidy.

## Repurposed thin client

After a while, I decided to explore running pihole for network-wide ad blocking and to offload some basic file-sharing duties from the router itself. In January 2020, I repurposed an Acer thin desktop client with a Celeron processor and 8GB RAM, installed Ubuntu Server on an SSD, and used this as my home server for some time.

This was—again—perfectly adequate for my needs at the time. I likely would have continued with this exact setup had I not gotten more ambitious. I recommend this route if you have a simple home network, have no interest in running too many server applications, aren’t interested in an onboard RAID setup, and are otherwise looking to run a network-wide ad blocker or some other light-duty services.

Either way, I recommend picking up a Dell Wyse/Lenovo ThinkCentre/HP t-series thin client from eBay just to have around. Some of these machines have surprisingly good NICs in them, since they’re designed for enterprise or IoT edge deployments.

I also don’t have any pictures of this setup, but I promise it was similarly unremarkable and tidy.

## Raspberry pi with external hard drive

While running the thin client server, I became attracted to the idea of a headless digital music player for the living room stereo, with low noise and low power consumption.

Rather than buying any new hardware, in October 2021, I fished out a Raspberry Pi 2 I had kicking around in a junk drawer, resurrected it, installed Arch Linux ARM, connected the aforementioned external hard drive, and set up mpd. I used an external USB DAC/amp combo with ALSA to power my living room speakers. I controlled mpd either via ncmpcpp when ssh’d in, or via M.A.L.P. on my Android phone.

This worked about 60% of the time. The Raspberry Pi was a little underpowered to keep up with remote mpd commands from M.A.L.P., thus the library browsing experience was more than slightly frustrating. It also choked when transferring music to the hard drive over the network. To load more music on to the player without SMB or NFS sharing, I had to unplug the hard drive, load more music onto it from another computer, re-mount the drive, re-scan the library, and so on.

I would still like to have a remote-controlled network music player. If I wind up with some spare cash one day, I would love to build an Intel NUC into a passively-cooled Akasa Turing case and replicate this setup.

{{< img src="/images/pi.png" alt="A Rasperry Pi and an audio amplifier"
caption="Here’s a photo of my living room music streamer and the USB DAC/amp. I hid the hard drive in a cabinet below, since it made a good bit of noise." >}}

## FreeNAS on donor rack-mount server

After catching wind of my home server tinkering, my dad gifted me a decommissioned hardware firewall with server-grade components in November 2021. The firewall had a Supermicro motherboard, ECC RAM, a Xeon processor, a RAID backplane, a few hard drives, and a gigabit NUC in a rack-mount enclosure. I gladly accepted it and continued my research.

I installed FreeNAS on the system drive, configured the hard drives into a RAID0 stripe (they were low-capacity drives and didn’t learn too much about RAID configurations until later), and set up file sharing. I moved my music library from the external drive to the basement server, mounted the drive over the network on the Raspberry Pi, and resumed streaming music from the basement.

Despite the obvious drawbacks of running a noisy, low-capacity rack-mount server in a residential basement, I learned about RAID backplanes and took advantage of free server-grade components. I also learned about proper system control via IPMI, the importance of UPSes, and watched my power bill spike for a bit.

The Raspberry Pi was also still a little too underpowered to handle commands from M.A.L.P., so I ditched that idea altogether in my next iteration.

{{< img src="/images/rack.png" alt="An empty rack-mounted server enclosure"
caption="I don’t have any photos of this setup since I mostly remember it by sound, but here’s a picture of the enclosure itself just before the neighborhood scrap hauler took it away." >}}

## Near-silent ATX tower

By this point, I was familiar enough with FreeNAS and server hardware conventions that I decided to cut down on the noise in the basement, reduce my power bill somewhat, expand the storage of the server, and repurpose some desktop-grade hardware I had floating around.

In December 2021, I picked up a used Fractal Define R5 case from eBay for $50, four new 4TB Ironwolf hard drives for $300 total, and 1000w Seasonic ATX power supply for $225. Other than the power bills, this was first actual money I spent on my server thus far.

I ripped everything out of the rack-mount enclosure and rebuilt the server into the Fractal case. I installed a spare DVD optical drive for transferring years of personal archives on DVD back to hard disk. I also repurposed several 120mm PWM fans I had floating around.

Although less “professional,” I’m more familiar with the ATX form factor. The Fractal case has room for eight 3.5” hard drives, two 2.5” SSDs, and two optical drives. All the panels are lined with sound-dampening foam, and there’s a removable intake filter behind the front panel. All the hard drive trays come with rubber grommets to reduce rattle. I recommend this case and glad I bought it—if my server setup ever evolves further, I might repurpose the Fractal case for a workstation build.

The Ironwolf drives are plugged into the motherboard’s SATA interface and configured in a RAID5 array. I still have the SAS controller card, but prefer SATA drives due to their availability and relatively low cost.

I installed TrueNAS Scale, a Debian-based version of FreeNAS which users Docker containers and orchestration, rather than BSD jails. I’m not a fan of Docker in general but this makes application deployment and service containment considerably easier. These Docker containers (VMs, in essence) do not have access to any server or network resources that I don’t explicitly allow, so I feel medium-fine about exposing them to the clearweb.

I still wanted music in my living room, so I re-created the Raspberry Pi streamer setup as a Docker image with the music volume mounted. I ran a USB-to-Ethernet conversion from the basement up to the living room to use the DAC/amp via ALSA in the Docker container itself, learning about hardware passthrough with Docker in the process. I connected to the mpd server via M.A.L.P., as before.

Surprisingly enough, this Docker configuration actually worked, and I listened to music in my living room using this setup for quite some time with no fan noise or any visible computer to speak of. I also ran SoulseekQt in another Docker container on the server, so I was able to download music, import it into the library, and enjoy it within minutes.

{{< img src="/images/atx-progress-1.png" alt="A computer under construction" >}}

{{< img src="/images/atx-progress-2.png" alt="A computer in a messy basement"
caption="Here are some photos of the build underway on Christmas Eve 2021. Treadmills, appliances, cleaning products, and unused children's toys are all part of the residential basement server experience." >}}

{{< img src="/images/atx-finished.png" alt="A computer on a shelf in a basement"
caption="This is the finished tower, powered off in my basement on Christmas Day 2021; I think I was getting a baseline for its power draw. Those are our actual winter boots." >}}

## Getting serious about the network

As I began to accumulate files and bring personal cloud data in-house, I realized I needed to buckle down on my traffic hygiene so that any possibly hostile wireless device didn’t have access to my rapidly-expanding family archive. I also wanted to access my music library from outside the house, since it’s undeniably convenient to listen to music on your smartphone.

I researched how VLANs work, but realized my Synology router didn’t support true VLANs. Sure, I could force all my phones, IoT devices, and so forth on to the guest network—and this is what I did for some time—but the router software lacked the firewall controls I needed to make this work well.

In March 2022, I started researching pfsense using an array of virtual machines on my desktop, following Lawrence Systems’ tutorials on YouTube. I eventually felt comfortable enough to purchase a Protectcli Vault firewall for ~$500. This was a significant investment, but I figured it was relatively future-proof; Protectcli hardware comes aggressively specced for the money with coreboot pre-installed. Installing pfsense was a breeze, but configuring it for my real-world network took some learning.

I put the Synology router into bridge mode, purchased a second Synology mesh node for the attic office space, and wired the backhaul down to the router in the living room. All wired connections go through to the pfsense router on the LAN interface, while the Synology handles all wireless traffic on the OPT1 interface. I set up firewall rules to dictate which LAN devices are visible to the OPT1 network, and vice-versa. (I essentially treat all wireless devices as hostile, even somewhat trusted ones like our iPhones.)

To expose my music library to the outside world, I run Emby on the TrueNAS server in a Docker container. I set up dynamic DNS through pfsense with Google Domains. The IP address re-configuration daemon works flawlessly, but re-certifying the domain every so often with TXT authentication is a bit of a hassle.

I reverse-proxy incoming traffic on the wildcard subdomain to various Docker services on the TrueNAS server with HAProxy. Now that I learned how HAProxy works, it’s very easy for me to spin up a new Docker application in TrueNAS, configure HAProxy to direct traffic to the service, and access the application via HTTPS both inside the house and outside.

The setup with Emby also lets me grant guest access to friends so they can enjoy streaming from my music library as well.

Somewhere along the way, I deprioritized running pihole, so I set that back up on the Raspberry Pi along with cloudflared to provide DNS for the entire network. Now, even clients on my guest wireless network can enjoy an ad-free browsing experience.

{{< img src="/images/network-progress.png" alt="Networking equipment alongside a server, a laptop, and a laser printer" caption="Here’s a photo of the setup once everything worked in concert by April 2022. Given the number of things plugged in and running here, I’m quite proud of the power draw." >}}

{{< img src="/images/network-finished.png" alt="N" caption="Eventually I zip-tied everything to a pegboard to complete the home sysadmin aesthetic. With the exception of labeling all the ports, drops, and machines, this is pretty much my setup as it exists today." >}}

# Current configuration

From April 2022 to late November 2022.

### TrueNAS server

- 4x4TB hard disks in RAID5, 1x120GB SSD for system
- 7 datasets spread across 2 pools
- All accessed on-prem via SMB + NFS
- Regular per-dataset backups to Backblaze B2
- Running applications on server:
  - Minio - S3-compatible temporary storage
  - Emby - music, movies, audiobooks
  - Caddy - basic web hosting (serves this page)
  - Navidrome - lightweight, music-only playback

### Network

- CAT6 hard-wired between all access points
- LAN interface on router to unmanaged switch:
  - Pihole + cloudflared DNS
  - TrueNAS server
  - Second floor office drop
- OPT1 interface on router to WAP:
  - Synology wireless router on first floor drop
  - Synology access point in attic with wired backhaul
  - Handles both main + guest networks
- Running services on router:
  - ACME - manages SSL certificates
  - HAProxy - reverse-proxy for public-facing services
  - Tailscale - zero-config VPN; allows remote access to SMB and Pihole DNS
  - pfBlockerNG - GeoIP inbound traffic filtering
