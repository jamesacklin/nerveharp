---
title: "Using Tailscale for my home server"
pubDate: "12-12-2022"
description: "I recently did away with reverse-proxying HTTPS to my home server in favor of Tailscale, a one-click VPN."
---

As detailed in my previous post about my home server, I was using dynamic DNS
and HAProxy on my pfsense firewall to access my self-hosted services. I decided
to stop exposing port 443 inbound to the world and needed a VPN solution that
didn't involve lots of learning.

Enter Tailscale, a one-click VPN service built atop WireGuard. It supports
Google single-sign-on, and although it's a bit of centralized infrastructure I
have to rely on, the auth is as reasonably secure as anything else (Yubikey 2FA,
multiple-attempt lockout, secondary recovery mechanism, etc.).

My out-of-home access paradigm is now much simpler.

- I run Tailscale via a plugin on the pfsense firewall, which exposes the main
  subnet and all its service ports. I also have the firewall set as an exit node
  so I can to route all traffic through its Internet connection.
- I make the pihole DNS server available as local DNS to all connected clients.
- I run Tailscale on my other devices and access networked services as though
  I'm directly wired to them.

The end result:

- I run navidrome as my music server on the TrueNAS server.
- I access the music collection from my iPhone with the play:Sub app, pointed to
  an IP address on the main subnet. Music streams to my phone through the VPN.
- When I browse the web on my iPhone outside the home, I get all the ad-blocking
  benefits of pihole.
- I can SSH from any one client to another, regardless of where I am in the
  world.sub
- Port 443 inbound is closed on my home IP.

Everything seems to work as intended for the time being, so I'm pleased.
