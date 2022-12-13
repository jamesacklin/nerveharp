---
title: "FreeBSD 13 on a Lenovo x220"
date: "2022-12-13"
summary: "Some notes from my recent install of FreeBSD 13 on a Lenovo x220."
---

TL;DR: I followed the graphical installer, opted for the default ZFS/RAID0 and let the installer partition the system drive however it wanted to, and applied these tweaks.

My x220 itself has an i7 CPU, a 512GB SSD, and 16GB RAM. I upgraded the LCD screen to a [higher-quality IPS display panel](http://x220.mcdonnelltech.com/resources/) and disconnected the touchpad. I also removed the lid closure sensor, the webcam, and the internal microphone. This negated my need to install drivers or set bootloader options for these devices.

## X11

The last step of the installer asked if I'd like to chroot into the new system and apply any post-installation configs. I said yes and proceeded thusly.

I added my login user to the `video` and `wheel` groups:

```ksh
pw groupmod video -m james && pw groupmod wheel -m james
```

`dbus` is required for just about anything graphical, so I added this line to `/etc/rc.conf`:

```ksh
echo 'dbus_enable="YES"' >> /etc/rc.conf
```

I also enabled the stock `i915kms` driver:

```ksh
echo 'kld_list="i915kms"' >> /etc/rc.conf
```

Then, I installed the following:

```ksh
pkg install vim git stow xorg slim openbox firefox \
            xf86-input-keyboard xf86-input-mouse
```

I then set slim to handle graphical login:

```ksh
echo 'slim_enable="YES"' >> /etc/rc.conf
```

and start Openbox on login:

```ksh
echo 'exec openbox-session' >> /home/james/.xinitrc
```

## Permissions

I set permissions for the `wheel` group to allow the `doas` command:

```ksh
echo 'permit persist :wheel' >> /usr/local/etc/doas.conf
```


## Battery

I didn't go overboard with the kernel tunables, wifi power saving, and so on, keeping the configuration pretty elementary. I get about 5 hours of normal use with the 9-cell battery (which is ~10 years old, at about 95% capacity).

Here's what I added to `/etc/rc.conf`:

```txt
powerd_enable="YES"
powerd_flags="-a hiadaptive -b adaptive"
performance_cx_lowest="Cmax"
economy_cx_lowest="Cmax"
```

## Other optimizations

These are commented to be self-explanetory. Here's my `/etc/rc.conf`:

```txt
# Don't hang the boot process while waiting for DHCP
background_dhclient="YES"

# Clear /tmp on boot
clear_tmp_enable="YES"

# Enable Linux compatibility
linux_enable="YES"
```

And `/boot/loader.conf`:

```txt
autoboot_delay="2"

# More appropriate values for desktop use
kern.maxproc="100000"
kern.ipc.shmseg="1024"
kern.ipc.shmmni="1024"

# Enable the nub and disable the touchpad
hw.psm.trackpoint_support="1"
hw.psm.synaptics_support="0"

# Enable a faster implementation of soreceive
net.inet.tcp.soreceive_stream="1"

# Increase the network interface queue link
net.link.ifqmaxlen="2048"

# Enable hardware accelerated AES
aesni_load="YES"

# Load the H-TCP algorithm
cc_htcp_load="YES"

# Enable CPU firmware updates
cpuctl_load="YES"

# Enable CPU temperature monitoring
coretemp_load="YES"

# Enable LCD backlight control, ThinkPad buttons, etc
acpi_ibm_load="YES"
```

I don't usually stream music or watch videos on this computer, so I let Mozilla's [cubeb](https://github.com/mozilla/cubeb) library handle everything. 

## Dotfiles

By this point, I could log in to an X session with decent performance, battery life, an editor, a browser, and a way to configure my system.

I use [GNU Stow](https://www.gnu.org/software/stow/) to manage my dotfiles, so the rest was easy:

```ksh
git clone https://github.com/jamesacklin/dots
cd dots
stow openbox
```

This installed my window manager theme, made the correct changes to the right-click desktop menu, set my desktop background to light gray, and so on. I repeated the same `stow` command for the other programs and services I wanted to configure.

## Overall impressions

My entire experience was no more complicated than a typical Arch Linux installation. I wasn't anticipating a "just works" experience like Fedora or Ubuntu, but I was pleasantly suprised to find that my x220 now runs quietly and efficiently while I putter around.

I had previously committed this entire process on the same machine with OpenBSD, but I found that the CPU fan ran audibly. Some quick research online told me that the OpenBSD developers removed something questionable in the fan driver -- which is good and in line with their security goals but not great for me.

Thanks to [c0ffee.net](https://www.c0ffee.net/blog/freebsd-on-a-laptop) for almost all of these pointers.