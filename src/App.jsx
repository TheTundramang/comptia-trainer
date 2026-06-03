import { useState, useEffect, useRef } from "react";
import { useTheme } from "./useTheme.js";

const C = {
  bg:"var(--c-bg)", surface:"var(--c-surface)", border:"var(--c-border)", muted:"var(--c-muted)",
  text:"var(--c-text)", dim:"var(--c-dim)", d1:"#00b4d8", d2:"#f77f00", d3:"#4cc9f0",
  d4:"#e63946", d5:"#06d6a0", gold:"#ffd166", green:"#06d6a0", red:"#e63946",
  orange:"#f77f00", purple:"#9b5de5",
};
function hexRgb(hex){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return `${r},${g},${b}`;}
function scoreColor(p){return p>=80?C.green:p>=65?C.orange:C.red;}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const SK="netplus-v2";
const hasStorageShim=typeof window.storage?.get==="function"&&typeof window.storage?.set==="function";
async function loadSave(){try{let raw=null;if(hasStorageShim){const r=await window.storage.get(SK);raw=r?.value??null;}else{raw=localStorage.getItem(SK);}if(!raw)return{};const p=JSON.parse(raw);return(p&&typeof p==="object"&&!Array.isArray(p))?p:{};}catch{}return{};}
async function writeSave(d){try{if(hasStorageShim)await window.storage.set(SK,JSON.stringify(d));else localStorage.setItem(SK,JSON.stringify(d));}catch{}}

const FLASHCARD_DOMAINS=[
  {id:"fc1",name:"OSI & TCP/IP Models",color:C.d1,icon:"🧱",cards:[
    {term:"OSI Model — All 7 Layers",definition:"Physical · Data Link · Network · Transport · Session · Presentation · Application",acronym:"Please Do Not Throw Sausage Pizza Away (bottom to top). Or: All People Seem To Need Data Processing (top to bottom).",analogy:"Like mailing a letter: write it (Application), translate it (Presentation), open a connection (Session), choose delivery method (Transport), address it (Network), stamp it (Data Link), hand to mail carrier (Physical).",category:"Memorization"},
    {term:"Layer 1 — Physical",definition:"Transmits raw bits over a physical medium. Cables, connectors, hubs, voltage, signal timing.",acronym:"Layer 1 = CABLES AND SIGNALS. Hubs and repeaters live here. If you can touch it, it is probably Layer 1.",analogy:"The roads and highways that signals travel on. No addresses, no logic — just raw movement.",category:"OSI Layers"},
    {term:"Layer 2 — Data Link",definition:"Handles MAC addressing, frame formatting, and error detection within a single network segment. Switches operate here.",acronym:"Layer 2 = MAC plus FRAMES. Switches and NICs live here.",analogy:"The local neighborhood mail carrier who knows which house (MAC address) each letter goes to on your street.",category:"OSI Layers"},
    {term:"Layer 3 — Network",definition:"Responsible for logical IP addressing and routing packets between different networks. Routers operate here.",acronym:"Layer 3 = IP plus ROUTING. Routers live here.",analogy:"The GPS navigator that figures out how to get your package from one city to another, choosing the best route.",category:"OSI Layers"},
    {term:"Layer 4 — Transport",definition:"Provides end-to-end communication, segmentation, flow control, and error recovery. TCP and UDP operate here.",acronym:"Layer 4 = TCP and UDP. TRANSPORT = TRUCKS. TCP delivers with a signature. UDP tosses it and hopes.",analogy:"TCP is FedEx with signature confirmation. UDP is tossing a flyer out of a car window — fast, no guarantee.",category:"OSI Layers"},
    {term:"Layer 5 — Session",definition:"Establishes, manages, and terminates communication sessions between applications.",acronym:"Layer 5 = SESSIONS. Think: phone call setup and teardown.",analogy:"The handshake and goodbye of a phone call. It opens the conversation, keeps it alive, and formally ends it.",category:"OSI Layers"},
    {term:"Layer 6 — Presentation",definition:"Translates data formats, handles encryption and decryption, and compression.",acronym:"Layer 6 = TRANSLATION plus ENCRYPTION. SSL and TLS encryption starts here.",analogy:"The translator at the UN who converts what the speaker says into your language before it reaches your ears.",category:"OSI Layers"},
    {term:"Layer 7 — Application",definition:"Closest layer to the end user. Provides network services to applications. HTTP, DNS, SMTP, FTP operate here.",acronym:"Layer 7 = USER-FACING PROTOCOLS. HTTP, HTTPS, DNS, FTP, SMTP all live here.",analogy:"The actual app on your phone. Everything below is invisible infrastructure.",category:"OSI Layers"},
    {term:"TCP vs UDP",definition:"TCP: connection-oriented, guaranteed delivery, ordered, slower. UDP: connectionless, no guarantee, faster, used for streaming and VoIP.",acronym:"TCP = Trustworthy Careful Protocol. UDP = Unreliable Delivery Protocol by design — speed over reliability.",analogy:"TCP is a registered letter with a return receipt. UDP is dropping a postcard in a public mailbox.",category:"Protocols"},
    {term:"TCP/IP Model (4 layers)",definition:"Network Access, Internet, Transport, Application. Simpler than OSI — maps the real internet stack.",acronym:"NITA: Network Access, Internet, Transport, Application. TCP/IP is what your computer actually uses.",analogy:"TCP/IP is the real-world version of OSI. OSI is the textbook theory; TCP/IP is what your NIC actually does.",category:"Memorization"},
  ]},
  {id:"fc2",name:"IP Addressing & Subnetting",color:C.d2,icon:"🔢",cards:[
    {term:"IPv4 Address Classes",definition:"Class A: 1-126 mask 255.0.0.0. Class B: 128-191 mask 255.255.0.0. Class C: 192-223 mask 255.255.255.0.",acronym:"A = Army (huge, millions of hosts). B = Business (medium). C = Coffee shop (small, 254 hosts). 127 is loopback — it belongs to no class.",analogy:"Class A is a continent, Class B is a country, Class C is a city block.",category:"IP Addressing"},
    {term:"RFC 1918 Private IP Ranges",definition:"10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. Not routable on the public internet without NAT.",acronym:"Ten Tired Cats: 10, 172, 192. Private = not on the internet without NAT.",analogy:"Private IPs are like internal office extension numbers. Outsiders cannot dial your extension directly.",category:"IP Addressing"},
    {term:"Subnet Mask and CIDR",definition:"Defines the network vs host portion of an IP. /24 = 255.255.255.0 = 256 addresses, 254 usable hosts.",acronym:"CIDR cheat: /24 = 254 hosts. /25 = 126. /26 = 62. /27 = 30. Each step cuts hosts in half.",analogy:"A subnet mask is like a zip code — it tells you which addresses are in your neighborhood vs which require the post office (router).",category:"Subnetting"},
    {term:"Default Gateway",definition:"The IP address of the router interface on your local subnet. All traffic for other networks goes here first.",acronym:"DGW = Door to the outside world. No gateway configured = no internet.",analogy:"Your default gateway is the front door of your apartment building. Everything going outside goes through that one door.",category:"IP Addressing"},
    {term:"APIPA (169.254.x.x)",definition:"Automatic Private IP Addressing. Windows self-assigns a 169.254.x.x address when DHCP is unreachable.",acronym:"169.254 = DHCP IS DEAD. Seeing this means: check the DHCP server or the cable first.",analogy:"APIPA is your phone in airplane mode. You can see your own contacts but cannot call anyone outside.",category:"IP Addressing"},
    {term:"IPv6 Address Format",definition:"128 bits, 8 groups of 4 hex digits separated by colons. Leading zeros can be omitted. :: replaces consecutive zero groups.",acronym:"IPv6 = 128 bits, 8 groups, hex. fe80:: is link-local. :: shortens consecutive zero groups.",analogy:"IPv4 is a 10-digit phone number system running out of numbers. IPv6 is switching to a 32-digit system.",category:"IPv6"},
    {term:"NAT and PAT",definition:"NAT translates private IPs to a public IP for outbound internet traffic. PAT uses port numbers to track multiple sessions (many-to-one).",acronym:"NAT = Address swap at the border. PAT = Port Address Translation = what your home router does.",analogy:"NAT is your company lobby. Everyone inside has a desk, but all outgoing mail shows the company address. Replies come to the lobby and get forwarded inside.",category:"IP Addressing"},
  ]},
  {id:"fc3",name:"Ports & Protocols",color:C.d3,icon:"🔌",cards:[
    {term:"Critical Port Numbers",definition:"FTP:21, SSH:22, Telnet:23, SMTP:25, DNS:53, DHCP:67-68, HTTP:80, HTTPS:443, RDP:3389, SNMP:161-162, NTP:123, Syslog:514",acronym:"For Serious Dueling, Some Dudes Hit Hard Running Straight Now: FTP(21) SSH(22) DNS(53) SMTP(25) DHCP(67) HTTP(80) HTTPS(443) RDP(3389) SNMP(161) NTP(123)",analogy:"Ports are like apartment unit numbers. HTTP knocks on door 80. HTTPS knocks on 443. Port 22 is the secure back door for admins.",category:"Ports"},
    {term:"DNS (Domain Name System)",definition:"Translates domain names to IP addresses. UDP port 53 for queries, TCP port 53 for zone transfers.",acronym:"DNS = Phone Book of the Internet. UDP 53 = normal lookup. TCP 53 = zone transfer (copying entire DNS database).",analogy:"DNS is your phone contacts list. You say Call Mom and your phone looks up her number. Without DNS you memorize every IP.",category:"Protocols"},
    {term:"DHCP and the DORA Process",definition:"Automatically assigns IP, subnet mask, gateway, and DNS to clients. Ports 67 (server) and 68 (client). DORA: Discover, Offer, Request, Acknowledge.",acronym:"DORA: Discover, Offer, Request, Acknowledge. Think of Dora the Explorer — she is always asking for directions (IP info).",analogy:"DHCP is a hotel check-in. You arrive (Discover), they offer a room (Offer), you confirm (Request), they hand you the key (Acknowledge).",category:"Protocols"},
    {term:"SMTP, POP3, IMAP",definition:"SMTP (25 or 587): sends email. POP3 (110): downloads email and deletes from server. IMAP (143): syncs email and leaves on server.",acronym:"SMTP = Sends Mail To People. POP3 = Pulls Off and Purges. IMAP = I Keep All Mail synced everywhere.",analogy:"SMTP is the outgoing mail carrier. POP3 picks up mail and brings it home permanently. IMAP is a shared inbox — changes sync everywhere.",category:"Protocols"},
    {term:"SSH vs Telnet",definition:"Both provide remote terminal access. Telnet (port 23) is unencrypted. SSH (port 22) is encrypted and should always replace Telnet.",acronym:"Telnet = Text sent in the clear. DANGER. SSH = Secure Shell encrypted. Always use 22, never 23 in production.",analogy:"Telnet is shouting your password in a crowded airport. SSH is whispering it through a soundproof encrypted tunnel.",category:"Protocols"},
    {term:"FTP vs SFTP vs FTPS",definition:"FTP (21): unencrypted file transfer. SFTP (22): FTP over SSH, encrypted. FTPS (990): FTP with TLS encryption.",acronym:"FTP = Files Travel Plaintext bad. SFTP = Secure uses SSH port 22. FTPS = FTP plus TLS port 990.",analogy:"FTP sends your files in a glass envelope. SFTP and FTPS put them in a locked safe.",category:"Protocols"},
    {term:"SNMP (Simple Network Management Protocol)",definition:"Monitors and manages network devices. Port 161 for polls. Port 162 for traps. SNMPv3 adds encryption and authentication.",acronym:"161 = polling you ASK. 162 = traps device TELLS you. v1 and v2 = cleartext bad. v3 = encrypted good.",analogy:"SNMP is your building sensor system. You poll sensors to check temperature (161), and sensors automatically alert you when something breaks (162).",category:"Protocols"},
    {term:"NTP (Network Time Protocol)",definition:"Synchronizes clocks across network devices. UDP port 123. Critical for Kerberos authentication (5-minute tolerance) and log correlation.",acronym:"NTP = Network Time Police. If clocks drift more than 5 minutes, Kerberos tickets FAIL and Active Directory breaks.",analogy:"NTP is every clock in your office synchronized to the same atomic reference. If one clock is off, security logs and auth systems start lying.",category:"Protocols"},
  ]},
  {id:"fc4",name:"Network Devices & Security",color:C.d4,icon:"🖧",cards:[
    {term:"Hub vs Switch vs Router",definition:"Hub: Layer 1, floods all ports. Switch: Layer 2, forwards by MAC. Router: Layer 3, routes by IP between networks.",acronym:"Hub = Yell in a room. Switch = Whisper directly to one person (MAC table). Router = Send a letter to another city (IP routing).",analogy:"Hub is a megaphone. Switch is walkie-talkie with named contacts. Router is the post office that ships between cities.",category:"Devices"},
    {term:"Firewall Types",definition:"Packet Filter: stateless, checks headers only. Stateful: tracks connections. Application or Proxy: inspects content. NGFW: deep packet inspection at Layer 7.",acronym:"PSAP: Packet filter, Stateful, Application, NGFW. Each level reads deeper into the packet.",analogy:"Packet filter checks your ID. Stateful remembers you came in. NGFW reads your bag contents and knows your history.",category:"Security Devices"},
    {term:"IDS vs IPS",definition:"IDS (Intrusion Detection System): monitors and alerts, out-of-band. IPS (Intrusion Prevention System): sits inline, detects and blocks threats.",acronym:"IDS = I Detect and Scream. IPS = I Prevent and Stop. D = Detect only. P = Prevent actively.",analogy:"IDS is a smoke detector — screams but does not fight fire. IPS is a sprinkler system — detects AND douses automatically.",category:"Security Devices"},
    {term:"CIA Triad",definition:"Confidentiality: data is private. Integrity: data is unaltered. Availability: data is accessible when needed.",acronym:"CIA = the three pillars of security. Encryption protects C. Hashing protects I. Redundancy protects A.",analogy:"CIA is like a bank. Confidentiality = only you see your balance. Integrity = nobody can change it. Availability = the bank is open when you need it.",category:"Core Security"},
    {term:"AAA Framework",definition:"Authentication: verify identity. Authorization: define access rights. Accounting: log actions. Implemented by RADIUS (UDP) or TACACS+ (TCP).",acronym:"AAA = Who are you? What can you do? What did you do? RADIUS = UDP, combines auth+authz. TACACS+ = TCP, separates all three.",analogy:"AAA is a nightclub: ID check (Authentication), wristband for VIP access (Authorization), security camera recording everything (Accounting).",category:"Core Security"},
    {term:"DMZ (Demilitarized Zone)",definition:"A network segment between two firewalls hosting public-facing servers. Protects the internal LAN even if a DMZ server is compromised.",acronym:"DMZ = Middle zone. Public stuff lives here. Compromise of DMZ does not equal compromise of LAN.",analogy:"DMZ is the lobby of a secure building. Visitors access the lobby (public server), but a second locked door (firewall) blocks the inner offices.",category:"Network Zones"},
    {term:"Wireless Security Standards",definition:"WEP: broken and deprecated. WPA/TKIP: deprecated. WPA2/AES-CCMP: current standard. WPA3/SAE: latest with forward secrecy.",acronym:"WEP = Worthless Encryption Protocol. WPA = Weak Protection Attempt. WPA2 = What Professionals Actually use. WPA3 = What is Preferred Always.",analogy:"WEP is a combo lock where everyone knows the combo. WPA2 uses bank-vault mechanisms. WPA3 makes the vault even harder to crack.",category:"Wireless Security"},
    {term:"Principle of Least Privilege",definition:"Every user, system, and process should have only the minimum access required to perform their specific function.",acronym:"PoLP = Give keys only to the rooms you need. No master keys unless absolutely necessary.",analogy:"A hotel housekeeper card opens guest rooms and supply closet — not the server room or manager safe. Each role gets exactly what it needs.",category:"Access Control"},
  ]},
  {id:"fc5",name:"Troubleshooting Tools",color:C.d5,icon:"🔧",cards:[
    {term:"CompTIA 7-Step Troubleshooting Methodology",definition:"1-Identify the problem. 2-Establish theory. 3-Test theory. 4-Plan and implement solution. 5-Verify full functionality. 6-Document findings. 7-Implement preventive measures.",acronym:"I Theorize That Pros Verify Documentation Prevents: Identify, Theory, Test, Plan, Verify, Document, Prevent.",analogy:"A doctor does not prescribe before examining. Step 1 is always: ask questions and gather facts. Never jump to step 4 without completing 1-3.",category:"Methodology"},
    {term:"Essential CLI Commands",definition:"ping, tracert/traceroute, nslookup, ipconfig/ifconfig, netstat, arp -a, route print, pathping",acronym:"Please Trace Networks In Neat Rows And Produce: Ping, Tracert, NSLookup, Ipconfig, Netstat, Route, ARP, Pathping.",analogy:"These tools are your stethoscope and blood pressure cuff. You diagnose before you operate.",category:"CLI Tools"},
    {term:"ping",definition:"Sends ICMP echo requests to test basic Layer 3 IP connectivity. Tests reachability only — not DNS or application layers.",acronym:"ping = ICMP echo. Success = IP layer works. Fail could mean host down, ICMP blocked by firewall, or wrong IP.",analogy:"Ping is shouting someone's name in a building. Shout back = alive and reachable. Silence = gone, unreachable, or blocked.",category:"CLI Tools"},
    {term:"tracert and traceroute",definition:"Sends packets with incrementing TTL values to reveal each router hop. Shows path and latency at each hop to pinpoint drops.",acronym:"tracert = path detective. Each hop = one router. High latency at hop X means the problem is at or after hop X.",analogy:"tracert is package tracking step by step. Instead of just knowing it arrived, you see exactly which city it got stuck in.",category:"CLI Tools"},
    {term:"ipconfig commands (Windows)",definition:"ipconfig shows IP config. /all shows full details. /release drops DHCP lease. /renew requests new IP. /flushdns clears DNS cache.",acronym:"Release Renew Flush = the DHCP and DNS reset trinity. Do this in order when IP or DNS issues hit a Windows machine.",analogy:"ipconfig /release is checking out of a hotel. /renew is checking back in for a new room key. /flushdns clears your saved contacts for fresh lookups.",category:"CLI Tools"},
    {term:"nslookup",definition:"Queries DNS servers to resolve hostnames to IPs and vice versa. Used to diagnose DNS failures and verify DNS records.",acronym:"nslookup = ask the phone book operator. If ping-by-IP works but ping-by-name fails, nslookup is your next move.",analogy:"nslookup is calling the phone book operator and asking them to look up a name. If they cannot find it, DNS is broken.",category:"CLI Tools"},
    {term:"Wireshark",definition:"Packet capture tool that captures and analyzes network traffic in real time with full protocol decode for every frame.",acronym:"Wireshark = microscope for packets. Use it when you need to see exactly what is on the wire, not just test connectivity.",analogy:"Wireshark is a flight data recorder for your network. After a crash you play it back frame by frame to see exactly what happened.",category:"Tools"},
    {term:"RTO vs RPO",definition:"RTO (Recovery Time Objective): maximum acceptable downtime. RPO (Recovery Point Objective): maximum acceptable data loss measured in time.",acronym:"RTO = how fast you must RECOVER (downtime budget). RPO = how far back in time you can RESTORE (data loss budget).",analogy:"RTO is your deadline to reopen the store after a break-in. RPO is how old your security footage can be when you review it.",category:"Availability"},
    {term:"Cable Fault Types",definition:"Attenuation: signal loss over distance. Crosstalk: signal bleed between wire pairs (NEXT and FEXT). EMI: external electromagnetic interference. Open: broken conductor. Short: wires touching.",acronym:"ACE-OS: Attenuation, Crosstalk, EMI, Open, Short. A cable certifier tests for all five.",analogy:"Attenuation is a megaphone losing volume over distance. Crosstalk is overhearing the next cubicle. A short is two pipes colliding.",category:"Cable Issues"},
  ]},
  {id:"fc6",name:"Wireless & Cables",color:C.purple,icon:"📶",cards:[
    {term:"802.11 Standards",definition:"a: 5GHz/54Mbps. b: 2.4GHz/11Mbps. g: 2.4GHz/54Mbps. n (Wi-Fi 4): dual-band/600Mbps. ac (Wi-Fi 5): 5GHz/3.5Gbps. ax (Wi-Fi 6): dual-band/9.6Gbps.",acronym:"A Boy Got Netflix And Xfinity: a, b, g, n, ac, ax. Speed goes UP with each letter.",analogy:"Each 802.11 generation is like upgrading your car engine. Same roads (WiFi spectrum), but faster every generation.",category:"Wireless Standards"},
    {term:"2.4 GHz vs 5 GHz",definition:"2.4 GHz: longer range, slower, more interference, channels 1/6/11 are non-overlapping. 5 GHz: shorter range, faster, less interference.",acronym:"2.4 = Far but Slow and Crowded. Microwaves and baby monitors compete here. 5 = Near Fast and Clean.",analogy:"2.4 GHz is a freeway with many on-ramps — congested. 5 GHz is a toll road — fewer vehicles, much faster.",category:"Wireless"},
    {term:"Cable Categories",definition:"Cat5: 100Mbps/100m. Cat5e: 1Gbps/100m. Cat6: 10Gbps/55m. Cat6a: 10Gbps/100m. Cat7: 10Gbps shielded.",acronym:"5e is the standard install choice. Cat6a if you need 10G at full 100m. Higher category = tighter twists = less crosstalk.",analogy:"Cable categories are like water hose thickness. Higher category = wider hose = more data with less interference leakage.",category:"Copper Cables"},
    {term:"Fiber: Single-mode vs Multimode",definition:"Single-mode (SMF): thin core, laser light, long distances (km+), yellow jacket. Multimode (MMF): wider core, LED light, shorter distances under 500m, orange or aqua jacket.",acronym:"Single = one path = long distance. Multi = many paths = short distance. Yellow = go far. Orange = office use.",analogy:"Single-mode is a laser pointer through a tiny tube — precise and goes very far. Multimode is a flashlight through a wider tube — cheaper but light spreads.",category:"Fiber Cables"},
    {term:"Fiber Connectors",definition:"SC: push-pull click, 2.5mm ferrule. LC: small, used in SFPs, 1.25mm. ST: bayonet twist-lock. MPO or MTP: multi-fiber ribbon connector.",acronym:"SC = Stick and Click. LC = Little Connector in enterprise SFP slots. ST = Stick and Twist. LC is most common in modern data centers.",analogy:"SC clicks like a LEGO brick. ST twists like a camera lens. LC is the smallest — like micro-USB compared to regular USB.",category:"Fiber Cables"},
    {term:"802.1X and EAP",definition:"Port-based network access control. Uses a RADIUS server to authenticate users before granting network access. Used in WPA2 and WPA3-Enterprise.",acronym:"802.1X = Enterprise auth. RADIUS does the checking. EAP = transport framework for credentials. WPA2-Enterprise = WiFi with individual usernames.",analogy:"802.1X is a bouncer who calls headquarters (RADIUS server) to verify your ID before letting you in. Every person gets checked individually.",category:"Wireless Security"},
  ]},
];
const DOMAINS=[
  {id:1,name:"Networking Concepts",weight:"23%",color:C.d1,icon:"🌐",desc:"OSI model, protocols, IP addressing, ports, cloud",questions:[
    {topic:"OSI Model",q:"What does the OSI model stand for?",options:["Open Systems Interconnection","Operating System Interface","Open Source Integration","Optical Signal Interface"],answer:0,explanation:"OSI (Open Systems Interconnection) is a 7-layer conceptual framework describing how data travels between devices across a network.",analogy:"Think of the OSI model like mailing a letter. You write it (Application), seal it (Presentation), open a connection (Session), choose delivery (Transport), address it (Network), stamp it (Data Link), hand to mail carrier (Physical).",realWorld:"When your IT ticket says Layer 1 issue, it means check a cable or port, not software. Knowing the layer tells you exactly where to look."},
    {topic:"OSI Model",q:"Which OSI layer handles end-to-end delivery and flow control?",options:["Network","Data Link","Transport","Session"],answer:2,explanation:"Layer 4 (Transport) ensures data gets from one end to the other reliably. TCP provides guaranteed delivery; UDP is faster but unverified.",analogy:"TCP is FedEx with signature confirmation. UDP is dropping a flyer in a mailbox — faster, no confirmation.",realWorld:"VoIP calls use UDP because a tiny dropped packet sounds better than a delayed conversation. File downloads use TCP because every byte must arrive."},
    {topic:"IP Addressing",q:"What is the default subnet mask for a Class C network?",options:["255.0.0.0","255.255.0.0","255.255.255.0","255.255.255.128"],answer:2,explanation:"Class C uses 255.255.255.0 (/24), supporting 254 usable host addresses per subnet.",analogy:"A Class C subnet is like an apartment building with 254 units. The first three octets are the building address; the last octet is the unit number.",realWorld:"Most small office networks use /24. If you see 192.168.1.x on a ticket, that is a Class C private subnet."},
    {topic:"IP Addressing",q:"What private IP range covers Class A per RFC 1918?",options:["10.0.0.0-10.255.255.255","172.16.0.0-172.31.255.255","192.168.0.0-192.168.255.255","169.254.0.0-169.254.255.255"],answer:0,explanation:"RFC 1918 reserves 10.0.0.0/8 for private Class A use, offering over 16 million addresses.",analogy:"Private IPs are like internal phone extensions. They work inside the building but nobody outside can dial them directly.",realWorld:"Large enterprises use 10.x.x.x for internal infrastructure because of the massive address space."},
    {topic:"IP Addressing",q:"What address does a host self-assign when DHCP fails?",options:["127.0.0.1","0.0.0.0","169.254.x.x (APIPA)","192.168.0.1"],answer:2,explanation:"APIPA assigns a 169.254.x.x address when no DHCP server is reachable.",analogy:"APIPA is a walkie-talkie fallback. When the DHCP tower is down, you can talk to the person next to you but not outside the building.",realWorld:"If you see 169.254.x.x on ipconfig output, check if the DHCP server is reachable or if the NIC cable is connected."},
    {topic:"Protocols & Ports",q:"Which port does DNS use by default?",options:["53","80","443","25"],answer:0,explanation:"DNS uses port 53 (UDP for queries, TCP for zone transfers). It translates domain names into IP addresses.",analogy:"DNS is the internet phone book. You look up google.com and it gives you the IP address to call.",realWorld:"When a user cannot reach a website but can ping its IP directly, DNS is your first suspect. ipconfig /flushdns and nslookup are your tools."},
    {topic:"Protocols & Ports",q:"What port does HTTPS use?",options:["80","8080","443","8443"],answer:2,explanation:"HTTPS runs on port 443 and encrypts HTTP traffic using TLS.",analogy:"HTTP is like sending a postcard anyone can read. HTTPS is the same postcard inside a locked box.",realWorld:"When configuring firewall rules for a web server, open port 443 inbound. Port 80 is often redirected to 443 to force encryption."},
    {topic:"Protocols & Ports",q:"Which protocol automatically assigns IP addresses to devices?",options:["DNS","DHCP","ARP","SMTP"],answer:1,explanation:"DHCP automatically provides IP address, subnet mask, default gateway, and DNS server info to clients.",analogy:"DHCP is like a hotel front desk. Check in, get a room key (IP), get directions to the elevator (gateway), and the WiFi password (DNS).",realWorld:"Most helpdesk no-internet calls start with DHCP. Run ipconfig to verify the device received a valid IP."},
    {topic:"IPv6",q:"How many bits are in an IPv6 address?",options:["32","64","96","128"],answer:3,explanation:"IPv6 uses 128-bit addresses written as 8 groups of 4 hex digits.",analogy:"IPv4 gave 4 billion addresses. IPv6 gives each grain of sand on Earth its own address with room to spare.",realWorld:"You will see IPv6 in dual-stack environments. ipconfig shows both IPv4 and IPv6 on modern Windows machines."},
    {topic:"NAT",q:"What problem does NAT primarily solve?",options:["IPv4 address exhaustion","Routing loop prevention","MAC address conflicts","DNS resolution failures"],answer:0,explanation:"NAT lets many devices share one public IP address, conserving limited IPv4 addresses.",analogy:"NAT is like a company switchboard. One main number (public IP), 200 extensions (private IPs). Callers only see the main number.",realWorld:"Your home router uses NAT. Every device shares your ISP-assigned public IP."},
    {topic:"OSI Model",q:"At which OSI layer do routers primarily operate?",options:["Layer 1","Layer 2","Layer 3","Layer 4"],answer:2,explanation:"Routers operate at Layer 3 (Network) and forward packets based on IP addresses.",analogy:"A router is like a postal sorting facility. It reads the city on the package and decides which truck route to send it on.",realWorld:"When you add a static route with route add in Windows, you are manually telling the OS how to forward packets at Layer 3."},
    {topic:"Protocols & Ports",q:"Which port does SSH use?",options:["21","22","23","25"],answer:1,explanation:"SSH (Secure Shell) uses port 22 and provides encrypted remote terminal access.",analogy:"Telnet is shouting your password across a crowded room. SSH is whispering it through an encrypted tunnel.",realWorld:"You use PuTTY at FL to SSH into network devices. Port 22 needs to be open on the firewall for remote admin access."},
    {topic:"Cloud Concepts",q:"Which cloud model provides virtualized computing resources over the internet on-demand?",options:["SaaS","PaaS","IaaS","DaaS"],answer:2,explanation:"IaaS (Infrastructure as a Service) delivers virtualized hardware that customers configure themselves.",analogy:"IaaS is renting an empty warehouse. The building is there; you bring your own shelves and workers. PaaS gives the shelves too. SaaS is a fully stocked store.",realWorld:"Azure VMs and AWS EC2 are IaaS. When FL moves servers to the cloud, they are likely using IaaS."},
    {topic:"Protocols & Ports",q:"What port does RDP use?",options:["3389","5900","22","23"],answer:0,explanation:"RDP (Remote Desktop Protocol) uses TCP port 3389 for graphical remote access to Windows machines.",analogy:"RDP is like having a second monitor and keyboard for a computer in another room or country.",realWorld:"Port 3389 is a common attack target — it should be blocked from the public internet and accessed only via VPN."},
    {topic:"IP Addressing",q:"What is the IPv4 loopback address?",options:["192.168.0.1","10.0.0.1","127.0.0.1","172.16.0.1"],answer:2,explanation:"127.0.0.1 is the loopback address. Traffic sent here never leaves the host; it tests the TCP/IP stack locally.",analogy:"Pinging 127.0.0.1 is like calling your own voicemail to make sure your phone works before calling someone else.",realWorld:"If ping 127.0.0.1 fails, the TCP/IP stack itself is broken. This is your very first connectivity test."},
  ]},
  {id:2,name:"Network Implementation",weight:"19%",color:C.d2,icon:"🔧",desc:"Switching, routing, wireless, VLANs, cables",questions:[
    {topic:"Switching",q:"What device forwards frames based on MAC addresses at Layer 2?",options:["Hub","Router","Switch","Firewall"],answer:2,explanation:"A switch maintains a MAC address table and forwards frames only to the correct port.",analogy:"A hub is like yelling a message in a room. A switch walks directly to that person and whispers it.",realWorld:"When you plug a new device into a switch at FL, it learns the MAC address the first time traffic is sent."},
    {topic:"VLANs",q:"What is the primary purpose of a VLAN?",options:["Encrypt traffic between devices","Logically segment a network into broadcast domains","Increase physical port density","Connect two buildings wirelessly"],answer:1,explanation:"VLANs divide a physical switch into multiple logical networks. Devices in different VLANs cannot communicate without a router.",analogy:"VLANs are like different departments in an office building on the same floor (switch) with completely separate conversations.",realWorld:"At FL you likely use VLANs to separate employee computers, IP phones, printers, and guest WiFi on the same physical switches."},
    {topic:"Wireless",q:"Which 802.11 standard was the FIRST to support both 2.4 GHz and 5 GHz?",options:["802.11a","802.11g","802.11n","802.11ac"],answer:2,explanation:"802.11n (Wi-Fi 4) introduced dual-band support and MIMO antennas.",analogy:"2.4 GHz is a highway — long range but congested. 5 GHz is a toll road — faster and less congested but shorter range.",realWorld:"When users complain about slow WiFi, moving them from 2.4 GHz to 5 GHz often fixes it immediately."},
    {topic:"Cables",q:"What is the maximum segment length for Cat5e/Cat6 100BASE-T?",options:["50m","100m","150m","200m"],answer:1,explanation:"The maximum standard run for twisted pair Ethernet is 100 meters (328 feet).",analogy:"A garden hose loses water pressure over distance. At 100m the signal pressure drops too low to be reliable.",realWorld:"When running cable drops at FL, stay under 100m total. A cable certifier will fail runs that exceed this."},
    {topic:"Routing",q:"What routing protocol uses Dijkstra's algorithm and is classified as link-state?",options:["RIP","EIGRP","OSPF","BGP"],answer:2,explanation:"OSPF is a link-state protocol where every router has a complete network map and calculates the shortest path.",analogy:"RIP asks for directions hop-by-hop at every intersection. OSPF has a full GPS map of the entire city from the start.",realWorld:"OSPF is common in enterprise networks. BGP is used between ISPs on the internet backbone."},
    {topic:"Switching",q:"What does STP prevent on a switched network?",options:["IP address conflicts","Layer 2 broadcast storms and switching loops","Routing table corruption","Unauthorized VLAN access"],answer:1,explanation:"STP blocks redundant paths between switches to prevent loops which cause broadcast storms.",analogy:"Without STP a broadcast frame bounces between switches forever like two mirrors facing each other — except it melts your network.",realWorld:"If two switches are connected with two cables and STP is disabled, your network crashes instantly."},
    {topic:"Cables",q:"Which fiber connector uses a push-pull locking mechanism?",options:["ST","SC","LC","FC"],answer:1,explanation:"SC connectors use a push-pull mechanism and a 2.5mm ferrule, common in data centers.",analogy:"SC connectors click in like a LEGO brick — push to connect, pull to release. ST connectors twist like a camera lens.",realWorld:"LC connectors (used in SFP modules) are more common in modern enterprise gear. Know both for the exam."},
    {topic:"VLANs",q:"What is the purpose of a trunk port on a switch?",options:["Connects to an end-user device","Carries traffic for multiple VLANs using 802.1Q tags","Blocks all broadcast traffic","Provides PoE to an access point"],answer:1,explanation:"A trunk port carries tagged frames for multiple VLANs between switches or between a switch and a router.",analogy:"An access port is a single-lane road for one neighborhood. A trunk port is a multi-lane highway carrying labeled trucks for every neighborhood.",realWorld:"The uplink between your access switch and core switch at FL is almost certainly a trunk port carrying all VLANs."},
    {topic:"Wireless",q:"What encryption protocol did WPA2 introduce to replace TKIP?",options:["WEP","TKIP","CCMP/AES","SAE"],answer:2,explanation:"WPA2 uses CCMP based on AES encryption, significantly stronger than TKIP.",analogy:"TKIP was a quick patch on a broken lock. CCMP/AES replaced the entire lock with a bank-vault mechanism.",realWorld:"You should see WPA2-AES on all enterprise wireless networks. TKIP still configured is a security finding."},
    {topic:"Routing",q:"What type of address does a router use to make forwarding decisions?",options:["MAC address","IP address","Port number","VLAN ID"],answer:1,explanation:"Routers operate at Layer 3 and use IP addresses to determine where to forward packets.",analogy:"A router reads the city on the envelope (IP) to decide which postal region to forward it to. MAC only matters inside the local neighborhood.",realWorld:"This is why you need a default gateway configured. Without one, your computer cannot send traffic outside its subnet."},
    {topic:"Cables",q:"Which cable type is completely immune to electromagnetic interference?",options:["UTP","STP","Coaxial","Fiber optic"],answer:3,explanation:"Fiber optic transmits light rather than electrical signals, making it completely immune to EMI.",analogy:"Copper cables can pick up a nearby radio station. Fiber is a glass tube carrying a light beam — radio waves pass right through it.",realWorld:"In environments near heavy machinery or MRI machines, fiber is the right choice. It also cannot be tapped like copper."},
    {topic:"PoE",q:"What does PoE (802.3af) deliver to network devices?",options:["Faster data speeds","Electrical power over Ethernet cable","Wireless signal amplification","VLAN tagging"],answer:1,explanation:"PoE delivers up to 15.4W of DC power over standard Cat5e/Cat6 cable.",analogy:"PoE is like a USB cable that also charges your phone while transferring data — one wire does two jobs.",realWorld:"Your IP phones, wireless APs, and IP cameras at FL are almost certainly powered by PoE from the switch."},
  ]},
  {id:3,name:"Network Operations",weight:"17%",color:C.d3,icon:"⚙️",desc:"Monitoring, documentation, policies, availability",questions:[
    {topic:"Monitoring",q:"What does SNMP stand for and what port does it use for queries?",options:["Simple Network Monitoring Protocol port 162","Simple Network Management Protocol port 161","Secure Node Management Protocol port 443","System Network Monitoring Protocol port 514"],answer:1,explanation:"SNMP uses UDP port 161 for polling devices and port 162 for traps.",analogy:"Port 161 is calling a friend to ask how they are (polling). Port 162 is your friend calling YOU to say something is wrong (trap).",realWorld:"NinjaRMM at FL uses SNMP under the hood. SNMPv3 is required for secure environments as v1/v2 send community strings in plaintext."},
    {topic:"Availability",q:"What does RTO stand for in disaster recovery?",options:["Recovery Time Objective","Redundant Transfer Operation","Remote Terminal Output","Routing Table Override"],answer:0,explanation:"RTO is the maximum acceptable downtime after a failure — how quickly the system must be restored.",analogy:"RTO is your deadline. If the business says we cannot be down more than 4 hours, that is your RTO.",realWorld:"When configuring backups for a critical server at FL, RTO tells you how fast the restore must be. A 15-minute RTO may require instant failover."},
    {topic:"Availability",q:"What does RPO define in a backup strategy?",options:["Redundant Power Output","Recovery Point Objective","Remote Protocol Override","Routing Protocol Optimization"],answer:1,explanation:"RPO defines the maximum tolerable data loss measured in time, determining backup frequency.",analogy:"RPO is how far back in time you are willing to go. A 1-hour RPO means backups every hour.",realWorld:"If FL runs nightly backups, the RPO is roughly 24 hours. More critical systems need shorter RPO."},
    {topic:"Tools",q:"What Windows command displays the routing table?",options:["ipconfig /all","netstat -r","route print","tracert /table"],answer:2,explanation:"route print displays the full IP routing table including destinations, gateways, interfaces, and metrics.",analogy:"The routing table is your GPS memory. route print shows every saved destination and which road to take.",realWorld:"If a device cannot reach a specific subnet, route print tells you if a static route is missing or pointing to the wrong gateway."},
    {topic:"Monitoring",q:"What is a network baseline used for?",options:["Setting minimum bandwidth requirement","Documenting normal performance to detect anomalies","Configuring the default gateway","Defining the IP addressing scheme"],answer:1,explanation:"A baseline captures normal network metrics during typical operation. Deviations indicate potential problems.",analogy:"A baseline is knowing your normal resting heart rate is 65 BPM. Suddenly seeing 120 BPM at rest tells you something is wrong.",realWorld:"Before deploying a new application at FL, capture a baseline. After deployment compare metrics to detect unexpected traffic spikes."},
    {topic:"QoS",q:"What does QoS stand for and what is its main function?",options:["Quality of Service prioritizes certain traffic types","Quantity of Streams limits simultaneous connections","Queue of Sessions organizes pending connections","Query on Subnet locates devices"],answer:0,explanation:"QoS marks and prioritizes traffic so latency-sensitive data like voice and video gets through first during congestion.",analogy:"QoS is an HOV lane on the freeway. High-priority traffic like VoIP gets a dedicated fast lane while other traffic waits.",realWorld:"If users at FL complain that voice calls drop during business hours, QoS misconfiguration on the switch is often the cause."},
    {topic:"Documentation",q:"What is the purpose of a change management process?",options:["Automatically block all network changes","Document review approve and communicate changes before implementation","Upgrade firmware on all devices at once","Track which users modified files"],answer:1,explanation:"Change management ensures all network changes are planned, documented, tested, approved, and communicated.",analogy:"Skipping change management is like rewiring your electrical panel without turning off the breaker. You might be fine, but the consequences of being wrong are catastrophic.",realWorld:"At FL, every Group Policy update or Conditional Access policy change should go through a change request. Unplanned changes are the leading cause of outages."},
    {topic:"Availability",q:"What does MTTR measure?",options:["Maximum Transfer Time Ratio","Mean Time to Repair","Multi-Tier Threat Response","Monthly Traffic Throughput Report"],answer:1,explanation:"MTTR is the average time required to fix a failed component. Lower MTTR means faster recovery.",analogy:"MTTR is your pit crew speed. Faster tire change means less downtime. In networking, faster MTTR means less time offline.",realWorld:"Tracking MTTR on help desk tickets at FL tells leadership how efficiently the IT team resolves issues."},
    {topic:"Monitoring",q:"Which protocol synchronizes time across network devices?",options:["SNMP","Syslog","NTP","SMTP"],answer:2,explanation:"NTP synchronizes clocks across network devices. Accurate time is critical for Kerberos authentication and log correlation.",analogy:"NTP is every clock in your office synchronized to the same atomic reference. Drift means security logs and auth systems start lying.",realWorld:"If AD authentication starts failing with Kerberos errors at FL, check if the domain controller NTP sync is broken. A 5-minute skew breaks Kerberos entirely."},
    {topic:"Documentation",q:"What is the purpose of a network diagram?",options:["Replace physical cable labels","Provide a visual map of network topology devices and connections","Automatically configure IP addresses","Monitor bandwidth in real time"],answer:1,explanation:"A network diagram documents the logical and physical layout of the network, essential for troubleshooting and planning.",analogy:"A network diagram is a building floor plan. Without it, you guess where the pipes are every time something leaks.",realWorld:"When onboarding at a new job or troubleshooting a complex issue at FL, an up-to-date network diagram saves hours of detective work."},
  ]},
  {id:4,name:"Network Security",weight:"20%",color:C.d4,icon:"🔒",desc:"Attacks, firewalls, authentication, encryption",questions:[
    {topic:"Attacks",q:"What attack overwhelms a target with traffic to deny service to legitimate users?",options:["Man-in-the-Middle","Phishing","DoS/DDoS","SQL Injection"],answer:2,explanation:"A DoS attack floods a target to exhaust resources. DDoS uses many distributed sources via a botnet.",analogy:"A DoS attack is 10,000 prank callers calling a pizza shop simultaneously. Real customers cannot get through.",realWorld:"Cloudflare and Akamai provide DDoS mitigation by absorbing traffic before it reaches your servers."},
    {topic:"AAA",q:"What does AAA stand for in network security?",options:["Authentication Authorization Accounting","Access Administration Auditing","Authorization Administration Alerts","Authentication Auditing Accountability"],answer:0,explanation:"AAA covers Authentication (prove who you are), Authorization (define what you can do), and Accounting (log what you did).",analogy:"AAA is a nightclub. Authentication is the bouncer checking your ID. Authorization is the wristband for certain areas. Accounting is the security camera.",realWorld:"At FL when a user logs into the VPN, CATO authenticates them, checks device compliance (Authorization), and logs the session (Accounting)."},
    {topic:"Firewalls",q:"Which firewall type inspects traffic at the application layer?",options:["Packet filtering firewall","Stateful firewall","Next-Generation Firewall (NGFW)","Circuit-level gateway"],answer:2,explanation:"NGFWs perform deep packet inspection at Layer 7, identifying applications, users, and content.",analogy:"A packet filter checks the label on a box. A stateful firewall checks if the box was expected. An NGFW opens the box and reads what is inside.",realWorld:"Microsoft Defender Firewall is stateful. An NGFW like Palo Alto can block specific apps like TikTok even on allowed ports."},
    {topic:"Network Zones",q:"What is a DMZ in network security architecture?",options:["A zone where all traffic is encrypted","A perimeter network hosting public-facing servers between two firewalls","A VLAN reserved for guest WiFi only","A subnet with all routing disabled"],answer:1,explanation:"A DMZ sits between the public internet and internal network, hosting public-accessible servers while protecting the LAN.",analogy:"DMZ is the lobby of a secure building. Visitors access the lobby but a second locked door blocks the inner offices.",realWorld:"Web servers, mail relays, and VPN concentrators go in a DMZ so a compromise does not directly reach internal systems."},
    {topic:"Attacks",q:"What attack secretly positions an attacker between two communicating parties?",options:["Replay attack","Man-in-the-Middle (MitM)","Brute force","Spoofing"],answer:1,explanation:"A MitM attack intercepts communications without the knowledge of either party.",analogy:"MitM is a dishonest postal worker opening your mail, reading it, resealing it, and delivering it. Both parties think communication was private.",realWorld:"Using public WiFi without a VPN exposes you to MitM. HTTPS and VPNs protect against this."},
    {topic:"Wireless Security",q:"What does WPA3 use to replace the vulnerable 4-way handshake?",options:["TKIP","SAE (Simultaneous Authentication of Equals)","EAP-TLS","CCMP"],answer:1,explanation:"WPA3 uses SAE which provides forward secrecy and resists offline dictionary attacks.",analogy:"The WPA2 handshake is like showing your house key to a locksmith who could photograph it. SAE proves you know the key without ever revealing it.",realWorld:"WPA3 is becoming standard on modern APs. WPA2-Enterprise with EAP-TLS is still the gold standard for enterprise WiFi."},
    {topic:"IDS/IPS",q:"What is the key difference between an IDS and an IPS?",options:["IDS detects and blocks; IPS only alerts","IDS alerts only; IPS detects and actively blocks threats","They are identical just different vendor names","IDS works on wireless; IPS works on wired only"],answer:1,explanation:"IDS monitors and generates alerts but takes no action. IPS sits inline and can drop malicious traffic in real time.",analogy:"IDS is a smoke detector — screams but does not fight fire. IPS is a sprinkler system — detects AND douses automatically.",realWorld:"Abnormal Security at FL is essentially an AI-based IDS for email. Microsoft Defender acts as an IPS by quarantining threats."},
    {topic:"Attacks",q:"What attack sends fake ARP replies to link the attacker's MAC to a legitimate IP?",options:["DNS poisoning","ARP poisoning/spoofing","VLAN hopping","MAC flooding"],answer:1,explanation:"ARP spoofing sends fake ARP replies associating the attacker's MAC with a victim's IP, enabling traffic interception.",analogy:"ARP spoofing is printing fake business cards with your competitor's name and your phone number. People think they are calling the real company.",realWorld:"Dynamic ARP Inspection on managed switches at FL can prevent ARP spoofing by validating packets against the DHCP binding table."},
    {topic:"Least Privilege",q:"What is the principle of least privilege?",options:["All users get admin rights by default","Users get only the minimum access required to perform their job","Privilege is granted based on seniority","All users share a single common account"],answer:1,explanation:"Least privilege limits each user or process to only the permissions necessary for their specific role.",analogy:"Least privilege is a hotel key card. The housekeeper opens guest rooms and supply closet but not the server room or manager safe.",realWorld:"At FL, standard helpdesk accounts should not have Domain Admin rights. Separate admin accounts limit the blast radius of a phishing compromise."},
    {topic:"Encryption",q:"Which protocol replaced SSL and is used to secure HTTPS today?",options:["SSH","IPsec","TLS","PPTP"],answer:2,explanation:"TLS (Transport Layer Security) replaced the deprecated SSL protocol. TLS 1.2 and 1.3 are current standards.",analogy:"SSL was an old padlock with a known weakness in the metal. TLS is the upgraded padlock. The door (HTTPS) is the same — the lock got better.",realWorld:"When you see a padlock in Chrome, TLS is protecting the connection. TLS 1.0 and 1.1 are deprecated and may be blocked by Conditional Access at FL."},
    {topic:"Firewalls",q:"What is the key difference between a stateful and stateless firewall?",options:["Stateful firewalls are faster","Stateful firewalls track connection state; stateless inspect each packet in isolation","Stateless firewalls cost more","Stateful firewalls only work with IPv6"],answer:1,explanation:"A stateful firewall tracks TCP/UDP connection state and allows return traffic automatically. Stateless treats every packet independently.",analogy:"A stateless firewall checks every person at the door with no memory. A stateful firewall remembers who went in and automatically lets them back out.",realWorld:"Windows Firewall is stateful — outbound connections automatically allow return traffic. Stateless ACLs on routers require explicit inbound and outbound rules."},
  ]},
  {id:5,name:"Network Troubleshooting",weight:"21%",color:C.d5,icon:"🔍",desc:"Methodology, tools, cable faults, wireless issues",questions:[
    {topic:"Methodology",q:"What is the FIRST step in CompTIA's troubleshooting methodology?",options:["Establish a theory of probable cause","Identify the problem","Test the theory","Implement the solution"],answer:1,explanation:"Step 1 is identifying the problem: gather information, question users, identify symptoms, and determine what recently changed.",analogy:"A doctor does not prescribe the moment you walk in. They ask questions and check symptoms first. Jumping to solutions wastes time.",realWorld:"When a ticket says internet is down at FL, your first questions are: which device, since when, did anything change, is it one user or the whole building."},
    {topic:"Tools",q:"What command sends ICMP echo requests to test basic IP connectivity?",options:["tracert","nslookup","ping","netstat"],answer:2,explanation:"Ping sends ICMP echo requests and listens for replies, confirming basic IP connectivity.",analogy:"Ping is shouting someone's name across a room. Shout back means they are there and can hear you.",realWorld:"ping 8.8.8.8 tests internet connectivity. ping google.com tests connectivity AND DNS. If the first works but not the second, DNS is broken."},
    {topic:"Tools",q:"What command shows every hop a packet takes to reach its destination?",options:["ping","tracert / traceroute","ipconfig","arp -a"],answer:1,explanation:"tracert (Windows) and traceroute (Linux/Mac) reveal each router hop and response time along the path.",analogy:"tracert is like package tracking step by step. Instead of just knowing it arrived, you see every city it passed through.",realWorld:"When users report slow cloud application access at FL, tracert shows exactly which hop is introducing latency."},
    {topic:"Tools",q:"What does ipconfig /release followed by ipconfig /renew accomplish?",options:["Resets all firewall rules","Releases the DHCP lease and requests a new IP address","Clears the ARP table","Flushes the DNS resolver cache"],answer:1,explanation:"/release drops the current DHCP-assigned address. /renew sends a new DHCP Discover to get a fresh assignment.",analogy:"ipconfig /release is checking out of your hotel room. ipconfig /renew is walking back to the front desk for a new room key.",realWorld:"This is one of your first moves on an internet-down ticket at FL. It costs 10 seconds and fixes a surprising number of DHCP problems."},
    {topic:"Tools",q:"What does ipconfig /flushdns do?",options:["Renews the DHCP lease","Clears the local DNS resolver cache","Resets the NIC driver","Removes all static routes"],answer:1,explanation:"/flushdns clears the DNS cache on Windows, forcing fresh lookups for all domain names.",analogy:"Your computer caches DNS results like a browser caches web pages. flushdns wipes that cache for fresh lookups.",realWorld:"After a DNS change at FL like moving a server to a new IP, affected users run ipconfig /flushdns to immediately pick up the new record."},
    {topic:"Tools",q:"What tool captures and analyzes packets on a network interface in real time?",options:["Nmap","Wireshark","Netstat","PingPlotter"],answer:1,explanation:"Wireshark is a packet analyzer that captures and displays network frames with full protocol decode.",analogy:"Wireshark is a flight data recorder for your network. After a crash you play it back frame by frame.",realWorld:"You already use Wireshark at FL. When Abnormal Security flags suspicious traffic, Wireshark lets you capture and verify what is actually being sent."},
    {topic:"Troubleshooting",q:"A user can ping 8.8.8.8 but cannot load any websites. What is the most likely cause?",options:["No default gateway","DNS resolution failure","Physical cable disconnected","Firewall blocking all HTTP traffic"],answer:1,explanation:"If IP-layer connectivity works but name resolution fails, DNS is the issue.",analogy:"You can dial a phone number and get through, but the address book is corrupted so you cannot look up names. Connectivity works; name lookup is broken.",realWorld:"Run nslookup google.com to confirm DNS failure. Then check if the DNS server IP in ipconfig /all is correct and reachable."},
    {topic:"Cable Issues",q:"What cable problem causes signals from one wire pair to bleed into an adjacent pair?",options:["Attenuation","Jitter","Crosstalk","EMI"],answer:2,explanation:"Crosstalk is electromagnetic interference between adjacent wire pairs inside a cable.",analogy:"Crosstalk is like whispering to your friend during a meeting but the person next to you overhears and gets confused.",realWorld:"A cable certifier at FL will flag crosstalk failures on improperly terminated or too-tightly-bent cables."},
    {topic:"Tools",q:"What tool generates a tone on a cable that a probe can follow through walls or bundles?",options:["Cable certifier","Tone generator and probe","OTDR","Multimeter"],answer:1,explanation:"A tone generator injects an audible signal. The inductive probe amplifies and plays the tone when held near the cable.",analogy:"A tone generator is like putting a GPS tracker in a package. You hold the probe near bundles until you hear the tone loudest.",realWorld:"When you pull a new cable at FL and cannot find the other end in the patch panel, a tone generator saves hours."},
    {topic:"Wireless",q:"A wireless client shows excellent signal but has very slow throughput. What is the most likely cause?",options:["IP address conflict","Channel interference or congestion on the AP","Damaged fiber backbone","DNS misconfiguration"],answer:1,explanation:"High signal with poor throughput is the classic symptom of wireless interference or channel congestion.",analogy:"Signal strength is how loud the radio station is. Throughput is how clearly you understand it. A loud station with interference sounds like noise.",realWorld:"Check WiFi channel utilization using a WiFi analyzer app. If 20 APs are all on channel 6, switching to channels 1 or 11 will dramatically help."},
    {topic:"Methodology",q:"After implementing a solution, what should you do next according to CompTIA's methodology?",options:["Immediately close the ticket","Verify full system functionality and implement preventive measures","Begin troubleshooting the next issue","Reboot all switches"],answer:1,explanation:"After implementing a fix, verify the solution worked AND that no new problems were introduced. Then document and prevent.",analogy:"After fixing a leaky pipe, you turn the water back on and watch for new leaks before patching the wall.",realWorld:"After resolving a network outage at FL, verify end-to-end connectivity before closing the change window. Then update the runbook."},
  ]},
];
const S={
  app:{minHeight:"100vh",background:C.bg,fontFamily:"'Poppins',system-ui,sans-serif",color:C.text,overflowX:"hidden"},
  scan:{display:"none"},
  wrap:{maxWidth:740,margin:"0 auto",padding:"24px 20px",position:"relative",zIndex:2},
  divider:{height:2,background:"linear-gradient(90deg,transparent,#00b4d8,transparent)",margin:"24px 0",borderRadius:2},
  card:(border=C.border)=>({border:`1px solid ${border}`,borderRadius:16,padding:"20px 24px",background:C.surface,marginBottom:16,boxShadow:"var(--c-shadow)"}),
  label:(color=C.dim)=>({fontSize:11,letterSpacing:1,color,textTransform:"uppercase",fontWeight:600,marginBottom:8}),
  btn:(color,fill)=>({padding:"10px 22px",borderRadius:10,border:`1px solid ${color}`,background:fill?color:"transparent",color:fill?"#fff":color,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit",transition:"all 0.15s"}),
  optionBtn:(state,color)=>({display:"block",width:"100%",textAlign:"left",padding:"14px 16px",marginBottom:14,borderRadius:12,border:`1px solid ${state==="correct"?C.green:state==="wrong"?C.red:state==="selected"?color:C.border}`,background:state==="correct"?`rgba(${hexRgb(C.green)},0.1)`:state==="wrong"?`rgba(${hexRgb(C.red)},0.1)`:state==="selected"?`rgba(${hexRgb(color)},0.1)`:"transparent",color:state==="correct"?C.green:state==="wrong"?C.red:state==="selected"?color:C.dim,cursor:"pointer",fontSize:14,lineHeight:1.6,fontFamily:"inherit",fontWeight:500,transition:"all 0.15s"}),
  row:{display:"flex",gap:10,flexWrap:"wrap",marginTop:14},
  tag:(color)=>({fontSize:11,padding:"4px 12px",border:`1px solid ${color}`,borderRadius:20,color,fontWeight:600,display:"inline-block"}),
};

function ProgressBar({pct,color,height=4}){
  return <div style={{height,background:C.border,borderRadius:height/2,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:color,boxShadow:`0 0 6px ${color}`,transition:"width 0.4s"}}/></div>;
}
function MenuCard({icon,title,sub,color,onClick,locked}){
  return <div onClick={onClick} style={{...S.card(locked?C.border:color),cursor:locked?"not-allowed":"pointer",opacity:locked?0.5:1,display:"flex",alignItems:"center",gap:14}}><div style={{fontSize:28,minWidth:36,textAlign:"center"}}>{icon}</div><div style={{flex:1}}><div style={{fontSize:14,fontWeight:"bold",color:locked?C.dim:color,marginBottom:3}}>{title}</div><div style={{fontSize:11,color:C.dim}}>{sub}</div></div>{!locked&&<div style={{color,fontSize:16}}>›</div>}</div>;
}
function BackBtn({onClick,color}){
  return <button onClick={onClick} style={{...S.btn(color),padding:"7px 16px",fontSize:13,marginBottom:20}}>← Back</button>;
}

function buildDeck(domainId,save){
  const all=FLASHCARD_DOMAINS.flatMap(fd=>fd.cards.map(c=>({...c,deckColor:fd.color,deckName:fd.name,deckId:fd.id})));
  if(domainId==="all") return all;
  if(domainId==="starred"){const s=save.starredCards||[];return all.filter(c=>s.includes(c.term));}
  const fd=FLASHCARD_DOMAINS.find(f=>f.id===domainId);
  return fd?fd.cards.map(c=>({...c,deckColor:fd.color,deckName:fd.name,deckId:fd.id})):[];
}

function Celebration(){
  const items=Array.from({length:28},(_,i)=>({
    left:`${(i*37+7)%100}%`,
    delay:`${((i*0.13)%0.9).toFixed(2)}s`,
    dur:`${(1.1+(i%5)*0.18).toFixed(2)}s`,
    color:[C.green,C.gold,C.d1,C.d3,C.purple,C.d2,C.d5][i%7],
    size:5+(i%5),
  }));
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:50,overflow:"hidden"}}>
      <style>{`@keyframes floatUp{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(-110vh) rotate(720deg);opacity:0}}`}</style>
      {items.map((p,i)=>(
        <div key={i} style={{position:"absolute",top:"-10px",left:p.left,width:p.size,height:p.size,borderRadius:"50%",background:p.color,animation:`floatUp ${p.dur} ${p.delay} ease-in forwards`}}/>
      ))}
    </div>
  );
}

function ThemeToggle({isDark,toggleTheme}){
  return <button onClick={toggleTheme} title={isDark?"Light mode":"Dark mode"} style={{position:"fixed",bottom:20,right:20,width:42,height:42,borderRadius:21,border:"1px solid var(--c-border)",background:"var(--c-surface)",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"var(--c-shadow)",zIndex:999,transition:"all 0.2s"}}>{isDark?"☀️":"🌙"}</button>;
}

export default function App({onExit}){
  const {isDark,toggleTheme}=useTheme();
  const [save,setSave]=useState(null);
  const [screen,setScreen]=useState("home");
  const [quizState,setQuizState]=useState(null);
  const [fcState,setFcState]=useState(null);
  useEffect(()=>{
    loadSave().then(s=>{
      const data=s||{};
      const today=new Date().toISOString().slice(0,10);
      const yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10);
      const last=data.lastActive;
      let streak=data.streak||0;
      if(last===today){}
      else if(last===yesterday)streak++;
      else streak=1;
      const updated={...data,streak,lastActive:today};
      setSave(updated);
      writeSave(updated);
    });
  },[]);
  async function updateSave(patch){const next={...save,...patch};setSave(next);await writeSave(next);}
  const toggle=<ThemeToggle isDark={isDark} toggleTheme={toggleTheme}/>;
  function content(){
    if(save===null) return <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{color:C.dim,fontSize:15}}>Loading...</div></div>;
    const dp=save.domainProgress||{};
    const practiceUnlocked=DOMAINS.every(d=>dp[d.id]);
    if(screen==="home") return <HomeScreen save={save} dp={dp} practiceUnlocked={practiceUnlocked} setScreen={setScreen} setQuizState={setQuizState} setFcState={setFcState} onExit={onExit}/>;
    if(screen==="domainSelect") return <DomainSelectScreen dp={dp} setScreen={setScreen} setQuizState={setQuizState}/>;
    if(screen==="domainQuiz"&&quizState) return <QuizScreen quizState={quizState} setQuizState={setQuizState} save={save} updateSave={updateSave} setScreen={setScreen} mode="domain"/>;
    if(screen==="daily") return <DailyScreen dp={dp} setScreen={setScreen} setQuizState={setQuizState}/>;
    if(screen==="dailyQuiz"&&quizState) return <QuizScreen quizState={quizState} setQuizState={setQuizState} save={save} updateSave={updateSave} setScreen={setScreen} mode="daily"/>;
    if(screen==="practiceGate") return <PracticeGate practiceUnlocked={practiceUnlocked} dp={dp} setScreen={setScreen} setQuizState={setQuizState}/>;
    if(screen==="practiceQuiz"&&quizState) return <QuizScreen quizState={quizState} setQuizState={setQuizState} save={save} updateSave={updateSave} setScreen={setScreen} mode="practice"/>;
    if(screen==="result") return <ResultScreen quizState={quizState} setScreen={setScreen} setQuizState={setQuizState} save={save} updateSave={updateSave}/>;
    if(screen==="review") return <ReviewScreen quizState={quizState} setScreen={setScreen}/>;
    if(screen==="flashcards") return <FlashcardHome save={save} updateSave={updateSave} setFcState={setFcState} setScreen={setScreen}/>;
    if(screen==="fc-flip") return <FlashcardFlip fcState={fcState} setScreen={setScreen} save={save} updateSave={updateSave}/>;
    if(screen==="fc-drill") return <FlashcardDrill fcState={fcState} setScreen={setScreen} save={save}/>;
    if(screen==="fc-browse") return <FlashcardBrowse setScreen={setScreen} save={save}/>;
    return null;
  }
  return <>{toggle}{content()}</>;
}

function HomeScreen({save,dp,practiceUnlocked,setScreen,setQuizState,setFcState,onExit}){
  const attempts=Object.values(dp);
  const overallPct=attempts.length?Math.round(attempts.reduce((s,d)=>s+d.bestScore,0)/DOMAINS.length):0;
  const lastPractice=(save.practiceHistory||[]).slice(-1)[0];
  return(
    <div style={S.app}><div style={S.scan}/>
    <div style={S.wrap}>
      <div style={{textAlign:"center",marginBottom:28,position:"relative"}}>
        {onExit&&<button onClick={onExit} style={{position:"absolute",top:0,left:0,...S.btn(C.dim),padding:"4px 12px",fontSize:10}}>← ALL CERTS</button>}
        <div style={{fontSize:10,color:C.dim,letterSpacing:5,marginBottom:8}}>COMPTIA N10-009</div>
        <div style={{fontSize:26,fontWeight:"bold",letterSpacing:4,color:C.d1,textShadow:`0 0 24px rgba(${hexRgb(C.d1)},0.5)`,marginBottom:4}}>COMPTIA TRAINER</div>
        <div style={{fontSize:10,color:C.dim,letterSpacing:3}}>PROFESSOR MESSER ALIGNED &bull; ALL 5 DOMAINS</div>
      </div>
      <div style={S.divider}/>
      {save.streak>0&&<div style={{textAlign:"center",marginBottom:18}}>
        <div style={{fontSize:28}}>🔥</div>
        <div style={{fontSize:16,fontWeight:"bold",color:C.gold,letterSpacing:3}}>{save.streak} DAY STREAK</div>
        <div style={{fontSize:10,color:C.dim,letterSpacing:2,marginTop:2}}>{save.streak===1?"COME BACK TOMORROW TO BUILD IT":"KEEP IT GOING"}</div>
      </div>}
      {attempts.length>0&&(
        <div style={{...S.card(),marginBottom:16}}>
          <div style={S.label()}>Overall Readiness</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:28,fontWeight:"bold",color:scoreColor(overallPct)}}>{overallPct}%</div>
            <div style={{fontSize:11,color:C.dim}}>{attempts.length}/5 domains attempted</div>
          </div>
          <ProgressBar pct={overallPct} color={scoreColor(overallPct)}/>
          {overallPct>=80&&<div style={{fontSize:11,color:C.green,marginTop:8,letterSpacing:1}}>★ EXAM READY THRESHOLD MET</div>}
        </div>
      )}
      <MenuCard icon="📚" title="Domain Study" sub="5 domains · Professor Messer order" color={C.d1} onClick={()=>setScreen("domainSelect")}/>
      <MenuCard icon="⚡" title="Daily Quick Practice" sub={`10 questions · ${Object.keys(save.weakQuestions||{}).length>0?`${Object.keys(save.weakQuestions||{}).length} weak questions flagged`:"Based on domains you have completed"}`} color={C.gold} onClick={()=>setScreen("daily")}/>
      <MenuCard icon="🃏" title="Flashcards" sub="Flip · Drill · Browse · Acronyms & Analogies" color={C.purple} onClick={()=>{setFcState(null);setScreen("flashcards");}}/>
      <MenuCard icon={practiceUnlocked?"🎯":"🔒"} title="Full Practice Test" sub={practiceUnlocked?`90 questions · Timed · Full report${lastPractice?` · Last: ${lastPractice.pct}%`:""}` :"Complete all 5 domains to unlock"} color={practiceUnlocked?C.d4:C.muted} onClick={()=>setScreen("practiceGate")} locked={!practiceUnlocked}/>
      <div style={{marginTop:24}}>
        <div style={S.label()}>Domain Progress</div>
        {DOMAINS.map(d=>{
          const prog=dp[d.id];const pct=prog?.bestScore||0;
          return <div key={d.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{fontSize:16,width:24}}>{d.icon}</div>
            <div style={{flex:1}}><div style={{fontSize:12,color:d.color,marginBottom:3}}>{d.name}</div><ProgressBar pct={pct} color={d.color} height={3}/></div>
            <div style={{fontSize:13,fontWeight:"bold",color:prog?scoreColor(pct):C.muted,minWidth:40,textAlign:"right"}}>{prog?`${pct}%`:"—"}</div>
          </div>;
        })}
      </div>
      <div style={{marginTop:20,padding:"12px 16px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:11,color:C.dim,lineHeight:1.8}}>
        <span style={{color:C.d1}}>HOW TO USE: </span>Work through each Domain in order as you finish Professor Messer's videos. Use Flashcards anytime — great for quick review or studying with a partner. After all 5 domains, the Full Practice Test unlocks. Target 80%+ before exam day.
      </div>
    </div></div>
  );
}

function FlashcardHome({save,updateSave,setFcState,setScreen}){
  const starred=save.starredCards||[];
  const totalCards=FLASHCARD_DOMAINS.reduce((s,d)=>s+d.cards.length,0);
  return(
    <div style={S.app}><div style={S.scan}/>
    <div style={S.wrap}>
      <BackBtn onClick={()=>setScreen("home")} color={C.purple}/>
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:22,fontWeight:"bold",color:C.purple,letterSpacing:3,marginBottom:4}}>🃏 FLASHCARDS</div>
        <div style={{fontSize:11,color:C.dim,letterSpacing:2}}>ACRONYMS · ANALOGIES · DEFINITIONS</div>
      </div>
      <div style={S.divider}/>
      <div style={S.label()}>Choose a Mode</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:24}}>
        {[{mode:"fc-flip",icon:"🔄",label:"Flip",desc:"Tap to reveal",color:C.d1},{mode:"fc-drill",icon:"⚡",label:"Drill",desc:"Self-grade each card",color:C.gold},{mode:"fc-browse",icon:"📖",label:"Browse",desc:"Scrollable reference",color:C.d5}].map(m=>(
          <div key={m.mode} style={{...S.card(m.color),cursor:"pointer",textAlign:"center",padding:"16px 10px"}}
            onClick={()=>{setFcState({mode:m.mode,domainId:"all"});setScreen(m.mode);}}>
            <div style={{fontSize:24,marginBottom:6}}>{m.icon}</div>
            <div style={{fontSize:12,color:m.color,fontWeight:"bold",marginBottom:3}}>{m.label}</div>
            <div style={{fontSize:10,color:C.dim}}>{m.desc}</div>
          </div>
        ))}
      </div>
      <div style={S.label()}>Choose a Deck</div>
      {starred.length>0&&(
        <div style={{...S.card(C.gold),cursor:"pointer",display:"flex",alignItems:"center",gap:14}} onClick={()=>{setFcState({domainId:"starred"});setScreen("fc-flip");}}>
          <div style={{fontSize:22}}>⭐</div>
          <div style={{flex:1}}><div style={{fontSize:13,color:C.gold,fontWeight:"bold"}}>Starred Cards</div><div style={{fontSize:11,color:C.dim}}>{starred.length} cards marked for review</div></div>
          <div style={{color:C.gold}}>›</div>
        </div>
      )}
      <div style={{...S.card(C.purple),cursor:"pointer",display:"flex",alignItems:"center",gap:14}} onClick={()=>{setFcState({domainId:"all"});setScreen("fc-flip");}}>
        <div style={{fontSize:22}}>🌐</div>
        <div style={{flex:1}}><div style={{fontSize:13,color:C.purple,fontWeight:"bold"}}>All Topics</div><div style={{fontSize:11,color:C.dim}}>{totalCards} total cards across all decks</div></div>
        <div style={{color:C.purple}}>›</div>
      </div>
      {FLASHCARD_DOMAINS.map(fd=>(
        <div key={fd.id} style={{...S.card(fd.color),cursor:"pointer",display:"flex",alignItems:"center",gap:14}} onClick={()=>{setFcState({domainId:fd.id});setScreen("fc-flip");}}>
          <div style={{fontSize:20}}>{fd.icon}</div>
          <div style={{flex:1}}><div style={{fontSize:13,color:fd.color,fontWeight:"bold"}}>{fd.name}</div><div style={{fontSize:11,color:C.dim}}>{fd.cards.length} cards</div></div>
          <div style={{color:fd.color}}>›</div>
        </div>
      ))}
    </div></div>
  );
}

function FlashcardFlip({fcState,setScreen,save,updateSave}){
  const [deck,setDeck]=useState(()=>buildDeck(fcState?.domainId||"all",save));
  const [idx,setIdx]=useState(0);
  const [flipped,setFlipped]=useState(false);
  const [showAcronym,setShowAcronym]=useState(false);
  const [showAnalogy,setShowAnalogy]=useState(false);
  const starred=save.starredCards||[];
  if(!deck.length) return <div style={S.app}><div style={S.wrap}><BackBtn onClick={()=>setScreen("flashcards")} color={C.purple}/><div style={{color:C.dim,padding:20}}>No cards in this deck.</div></div></div>;
  const card=deck[idx];
  const color=card.deckColor||C.purple;
  const isStarred=starred.includes(card.term);
  function nav(dir){setIdx(i=>Math.max(0,Math.min(deck.length-1,i+dir)));setFlipped(false);setShowAcronym(false);setShowAnalogy(false);}
  async function toggleStar(){await updateSave({starredCards:isStarred?starred.filter(s=>s!==card.term):[...starred,card.term]});}
  function shuffleDeck(){setDeck(d=>shuffle([...d]));setIdx(0);setFlipped(false);setShowAcronym(false);setShowAnalogy(false);}
  useEffect(()=>{
    function onKey(e){
      if(e.target.tagName==="INPUT")return;
      if(e.key===" "||e.key==="Enter"){e.preventDefault();setFlipped(f=>!f);}
      if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();setIdx(i=>Math.min(deck.length-1,i+1));setFlipped(false);setShowAcronym(false);setShowAnalogy(false);}
      if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();setIdx(i=>Math.max(0,i-1));setFlipped(false);setShowAcronym(false);setShowAnalogy(false);}
    }
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[deck.length]);
  return(
    <div style={S.app}><div style={S.scan}/>
    <div style={S.wrap}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <BackBtn onClick={()=>setScreen("flashcards")} color={C.purple}/>
        <div style={{fontSize:11,color:C.dim,letterSpacing:2}}>{idx+1} / {deck.length}</div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={shuffleDeck} title="Shuffle deck" style={{...S.btn(C.d5),padding:"5px 12px",fontSize:13}}>⇄</button>
          <button onClick={toggleStar} style={{...S.btn(isStarred?C.gold:C.muted,isStarred),padding:"5px 12px",fontSize:13}}>{isStarred?"★":"☆"}</button>
        </div>
      </div>
      <div style={{height:3,background:C.border,borderRadius:2,marginBottom:20,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${Math.round(((idx+1)/deck.length)*100)}%`,background:color,transition:"width 0.3s"}}/>
      </div>
      <div style={{marginBottom:12}}>
        <span style={{...S.tag(color),marginRight:8}}>{card.deckName}</span>
        {card.category&&<span style={S.tag(C.muted)}>{card.category}</span>}
      </div>
      <div onClick={()=>setFlipped(f=>!f)} style={{cursor:"pointer",minHeight:160,border:`1px solid ${color}`,borderRadius:12,padding:"22px 20px",background:flipped?`rgba(${hexRgb(color)},0.07)`:C.surface,transition:"all 0.2s",marginBottom:14,position:"relative"}}>
        <div style={{fontSize:10,color,letterSpacing:3,marginBottom:10}}>{flipped?"DEFINITION":"TERM — TAP TO REVEAL"}</div>
        {!flipped
          ?<div style={{fontSize:18,fontWeight:"bold",color:C.text,lineHeight:1.5}}>{card.term}</div>
          :<div style={{fontSize:13,color:C.text,lineHeight:1.8}}>{card.definition}</div>
        }
        <div style={{position:"absolute",bottom:10,right:14,fontSize:10,color:C.muted}}>{flipped?"tap to flip back":"tap to reveal"}</div>
      </div>
      {flipped&&<div style={{marginTop:4}}>
        {(card.acronym||card.analogy)&&<div style={{fontSize:11,fontWeight:600,color:C.dim,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Study Aids</div>}
        {card.acronym&&<div style={{marginBottom:12}}>
          <button onClick={()=>setShowAcronym(a=>!a)} style={{width:"100%",textAlign:"left",padding:"14px 18px",borderRadius:showAcronym?"12px 12px 0 0":"12px",border:`2px solid ${C.gold}`,background:showAcronym?C.gold:`rgba(${hexRgb(C.gold)},0.08)`,color:showAcronym?"#1a1a1a":C.gold,cursor:"pointer",fontSize:15,fontWeight:600,fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all 0.15s"}}>
            <span>🧠 Memory Trick</span>
            <span style={{fontSize:12,opacity:0.7}}>{showAcronym?"▲ Hide":"▼ Show"}</span>
          </button>
          {showAcronym&&<div style={{padding:"16px 18px",background:`rgba(${hexRgb(C.gold)},0.07)`,border:`2px solid ${C.gold}`,borderTop:"none",borderRadius:"0 0 12px 12px",fontSize:14,color:C.text,lineHeight:1.85,fontWeight:500}}>{card.acronym}</div>}
        </div>}
        {card.analogy&&<div style={{marginBottom:12}}>
          <button onClick={()=>setShowAnalogy(a=>!a)} style={{width:"100%",textAlign:"left",padding:"14px 18px",borderRadius:showAnalogy?"12px 12px 0 0":"12px",border:`2px solid ${color}`,background:showAnalogy?color:`rgba(${hexRgb(color)},0.08)`,color:showAnalogy?"#fff":color,cursor:"pointer",fontSize:15,fontWeight:600,fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all 0.15s"}}>
            <span>💡 Analogy</span>
            <span style={{fontSize:12,opacity:0.7}}>{showAnalogy?"▲ Hide":"▼ Show"}</span>
          </button>
          {showAnalogy&&<div style={{padding:"16px 18px",background:`rgba(${hexRgb(color)},0.07)`,border:`2px solid ${color}`,borderTop:"none",borderRadius:"0 0 12px 12px",fontSize:14,color:C.text,lineHeight:1.85}}>{card.analogy}</div>}
        </div>}
      </div>}
      <div style={{fontSize:10,color:C.muted,letterSpacing:1,textAlign:"center",margin:"8px 0 4px"}}>Space flip &nbsp;·&nbsp; ← → navigate &nbsp;·&nbsp; ⇄ shuffle</div>
      <div style={S.row}>
        <button onClick={()=>nav(-1)} disabled={idx===0} style={{...S.btn(color),flex:1,opacity:idx===0?0.3:1}}>← PREV</button>
        <button onClick={()=>nav(1)} disabled={idx===deck.length-1} style={{...S.btn(color,true),flex:1,opacity:idx===deck.length-1?0.3:1}}>NEXT →</button>
      </div>
      {idx===deck.length-1&&<div style={{textAlign:"center",marginTop:12,fontSize:12,color:C.green}}>✓ End of deck</div>}
    </div></div>
  );
}

function FlashcardDrill({fcState,setScreen,save}){
  const [deck]=useState(()=>shuffle(buildDeck(fcState?.domainId||"all",save)));
  const [idx,setIdx]=useState(0);
  const [revealed,setRevealed]=useState(false);
  const [grades,setGrades]=useState([]);
  const [done,setDone]=useState(false);
  if(!deck.length) return <div style={S.app}><div style={S.wrap}><BackBtn onClick={()=>setScreen("flashcards")} color={C.purple}/><div style={{color:C.dim,padding:20}}>No cards in this deck.</div></div></div>;
  if(done){
    const got=grades.filter(g=>g==="got").length;
    const pct=Math.round((got/grades.length)*100);
    const missed=deck.filter((_,i)=>grades[i]==="missed");
    return(
      <div style={S.app}><div style={S.scan}/>
      <div style={S.wrap}>
        <div style={{textAlign:"center",padding:"28px 0 20px"}}>
          <div style={{fontSize:10,color:C.dim,letterSpacing:3,marginBottom:8}}>DRILL COMPLETE</div>
          <div style={{fontSize:60,fontWeight:"bold",color:scoreColor(pct),textShadow:`0 0 24px ${scoreColor(pct)}`}}>{pct}%</div>
          <div style={{fontSize:12,color:C.dim,marginTop:6}}>{got} / {grades.length} correct</div>
        </div>
        <div style={S.divider}/>
        {missed.length>0&&<div>
          <div style={S.label(C.red)}>Review These ({missed.length})</div>
          {missed.map((c,i)=>(
            <div key={i} style={{...S.card(),marginBottom:10}}>
              <div style={{fontSize:13,color:C.text,fontWeight:"bold",marginBottom:6}}>{c.term}</div>
              <div style={{fontSize:12,color:C.dim,lineHeight:1.7}}>{c.definition}</div>
              {c.acronym&&<div style={{fontSize:11,color:C.gold,marginTop:8,lineHeight:1.7,paddingLeft:8,borderLeft:`2px solid ${C.gold}`}}>{c.acronym}</div>}
            </div>
          ))}
        </div>}
        <div style={S.row}>
          <button onClick={()=>setScreen("flashcards")} style={{...S.btn(C.purple,true),flex:1}}>BACK TO DECKS</button>
        </div>
      </div></div>
    );
  }
  const card=deck[idx];
  const color=card.deckColor||C.purple;
  function grade(result){
    const ng=[...grades,result];
    setGrades(ng);
    if(idx+1>=deck.length){setDone(true);}
    else{setIdx(i=>i+1);setRevealed(false);}
  }
  const gradeRef=useRef();
  gradeRef.current=grade;
  useEffect(()=>{
    function onKey(e){
      if(e.target.tagName==="INPUT")return;
      if(!revealed){if(e.key===" "||e.key==="Enter"){e.preventDefault();setRevealed(true);}}
      else{
        if(e.key==="ArrowRight"||e.key==="g"||e.key==="G")gradeRef.current("got");
        if(e.key==="ArrowLeft"||e.key==="m"||e.key==="M")gradeRef.current("missed");
      }
    }
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[revealed]);
  return(
    <div style={S.app}><div style={S.scan}/>
    <div style={S.wrap}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <BackBtn onClick={()=>setScreen("flashcards")} color={C.purple}/>
        <div style={{fontSize:11,color:C.dim}}>{idx+1} / {deck.length}</div>
        <div style={{fontSize:11,color:C.green}}>{grades.filter(g=>g==="got").length} ✓</div>
      </div>
      <div style={{height:3,background:C.border,borderRadius:2,marginBottom:20,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${Math.round((idx/deck.length)*100)}%`,background:color}}/>
      </div>
      <div style={{marginBottom:12}}>
        <span style={{...S.tag(color),marginRight:8}}>{card.deckName}</span>
        {card.category&&<span style={S.tag(C.muted)}>{card.category}</span>}
      </div>
      <div style={{border:`1px solid ${color}`,borderRadius:12,padding:"22px 20px",background:C.surface,marginBottom:14}}>
        <div style={{fontSize:10,color,letterSpacing:3,marginBottom:10}}>TERM</div>
        <div style={{fontSize:18,fontWeight:"bold",color:C.text,lineHeight:1.5}}>{card.term}</div>
      </div>
      {!revealed
        ?<><button onClick={()=>setRevealed(true)} style={{...S.btn(color,true),width:"100%",padding:"13px",fontSize:12}}>REVEAL ANSWER</button>
          <div style={{fontSize:10,color:C.muted,letterSpacing:1,textAlign:"center",marginTop:8}}>Space / Enter to reveal</div></>
        :<div>
          <div style={{fontSize:10,color:C.muted,letterSpacing:1,textAlign:"center",marginBottom:8}}>← M missed &nbsp;·&nbsp; G → got it</div>
          <div style={{border:`1px solid ${color}`,borderRadius:12,padding:"20px",background:`rgba(${hexRgb(color)},0.05)`,marginBottom:14}}>
            <div style={{fontSize:10,color,letterSpacing:3,marginBottom:10}}>DEFINITION</div>
            <div style={{fontSize:13,color:C.text,lineHeight:1.8,marginBottom:card.acronym||card.analogy?12:0}}>{card.definition}</div>
            {card.acronym&&<div style={{borderTop:`1px solid ${C.border}`,paddingTop:10}}>
              <div style={{fontSize:10,color:C.gold,letterSpacing:2,marginBottom:4}}>MEMORY TRICK</div>
              <div style={{fontSize:12,color:C.gold,lineHeight:1.7}}>{card.acronym}</div>
            </div>}
            {card.analogy&&<div style={{borderTop:`1px solid ${C.border}`,paddingTop:10,marginTop:card.acronym?10:0}}>
              <div style={{fontSize:10,color:C.dim,letterSpacing:2,marginBottom:4}}>ANALOGY</div>
              <div style={{fontSize:12,color:C.dim,lineHeight:1.7}}>{card.analogy}</div>
            </div>}
          </div>
          <div style={{...S.row,marginTop:0}}>
            <button onClick={()=>grade("missed")} style={{...S.btn(C.red),flex:1,padding:"12px"}}>✗ MISSED IT</button>
            <button onClick={()=>grade("got")} style={{...S.btn(C.green,true),flex:1,padding:"12px"}}>✓ GOT IT</button>
          </div>
        </div>
      }
    </div></div>
  );
}

function FlashcardBrowse({setScreen,save}){
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [expanded,setExpanded]=useState(null);
  const starred=save.starredCards||[];
  const all=FLASHCARD_DOMAINS.flatMap(fd=>fd.cards.map(c=>({...c,deckColor:fd.color,deckName:fd.name,deckId:fd.id})));
  const filtered=all.filter(c=>{
    const mD=filter==="all"?true:filter==="starred"?starred.includes(c.term):c.deckId===filter;
    const mS=!search||c.term.toLowerCase().includes(search.toLowerCase())||c.definition.toLowerCase().includes(search.toLowerCase())||(c.acronym||"").toLowerCase().includes(search.toLowerCase());
    return mD&&mS;
  });
  return(
    <div style={S.app}><div style={S.scan}/>
    <div style={S.wrap}>
      <BackBtn onClick={()=>setScreen("flashcards")} color={C.purple}/>
      <div style={{fontSize:14,fontWeight:"bold",color:C.purple,letterSpacing:2,marginBottom:16}}>📖 BROWSE REFERENCE</div>
      <input placeholder="Search terms, definitions, acronyms..." value={search} onChange={e=>setSearch(e.target.value)}
        style={{width:"100%",padding:"10px 14px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:12,fontFamily:"inherit",marginBottom:12,boxSizing:"border-box"}}/>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20}}>
        <button onClick={()=>setFilter("all")} style={{...S.btn(filter==="all"?C.purple:C.muted,filter==="all"),padding:"5px 12px",fontSize:10}}>All</button>
        {starred.length>0&&<button onClick={()=>setFilter("starred")} style={{...S.btn(filter==="starred"?C.gold:C.muted,filter==="starred"),padding:"5px 12px",fontSize:10}}>⭐ Starred</button>}
        {FLASHCARD_DOMAINS.map(fd=>(
          <button key={fd.id} onClick={()=>setFilter(fd.id)} style={{...S.btn(filter===fd.id?fd.color:C.muted,filter===fd.id),padding:"5px 10px",fontSize:10}}>{fd.icon}</button>
        ))}
      </div>
      <div style={S.label()}>{filtered.length} cards</div>
      {filtered.map((card,i)=>{
        const open=expanded===i;
        return(
          <div key={i} style={{border:`1px solid ${open?card.deckColor:C.border}`,borderRadius:10,marginBottom:8,background:C.surface,overflow:"hidden"}}>
            <div onClick={()=>setExpanded(open?null:i)} style={{padding:"14px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:12,fontWeight:"bold",color:card.deckColor,marginBottom:3}}>{card.term}</div>
                <div style={{fontSize:10,color:C.dim}}>{card.deckName} · {card.category}</div>
              </div>
              <div style={{color:open?card.deckColor:C.muted,fontSize:16,transition:"transform 0.2s",transform:open?"rotate(90deg)":"none"}}>›</div>
            </div>
            {open&&<div style={{padding:"0 16px 16px",borderTop:`1px solid ${C.border}`}}>
              <div style={{fontSize:12,color:C.text,lineHeight:1.8,marginTop:12}}>{card.definition}</div>
              {card.acronym&&<div style={{padding:"10px 12px",background:`rgba(${hexRgb(C.gold)},0.06)`,border:`1px solid ${C.gold}`,borderRadius:8,marginTop:10}}>
                <div style={{fontSize:10,color:C.gold,letterSpacing:2,marginBottom:4}}>MEMORY TRICK</div>
                <div style={{fontSize:12,color:C.gold,lineHeight:1.7}}>{card.acronym}</div>
              </div>}
              {card.analogy&&<div style={{padding:"10px 12px",background:`rgba(${hexRgb(card.deckColor)},0.05)`,border:`1px solid ${card.deckColor}`,borderRadius:8,marginTop:8}}>
                <div style={{fontSize:10,color:card.deckColor,letterSpacing:2,marginBottom:4}}>ANALOGY</div>
                <div style={{fontSize:12,color:C.dim,lineHeight:1.7}}>{card.analogy}</div>
              </div>}
            </div>}
          </div>
        );
      })}
      {!filtered.length&&<div style={{textAlign:"center",padding:"32px",color:C.dim,fontSize:12}}>No cards match your search.</div>}
    </div></div>
  );
}
function DomainSelectScreen({dp,setScreen,setQuizState}){
  return(
    <div style={S.app}><div style={S.scan}/>
    <div style={S.wrap}>
      <BackBtn onClick={()=>setScreen("home")} color={C.d1}/>
      <div style={S.label(C.d1)}>Select a Domain</div>
      {DOMAINS.map(d=>{
        const prog=dp[d.id];const pct=prog?.bestScore||0;
        return(
          <div key={d.id} style={{...S.card(d.color),cursor:"pointer"}}
            onClick={()=>{setQuizState({mode:"domain",domain:d,questions:d.questions.map(q=>({...q,domainId:d.id,domainName:d.name,domainColor:d.color})),qIdx:0,answers:[],score:0,confidence:[]});setScreen("domainQuiz");}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:10,color:C.dim,letterSpacing:2,marginBottom:4}}>DOMAIN {d.id} · {d.weight}</div>
                <div style={{fontSize:15,color:d.color,fontWeight:"bold",marginBottom:4}}>{d.icon} {d.name}</div>
                <div style={{fontSize:11,color:C.dim}}>{d.desc}</div>
                <div style={{fontSize:11,color:C.dim,marginTop:4}}>{d.questions.length} questions</div>
              </div>
              <div style={{textAlign:"right"}}>
                {prog?<><div style={{fontSize:20,fontWeight:"bold",color:scoreColor(pct)}}>{pct}%</div><div style={{fontSize:10,color:C.dim}}>{prog.attempts} run{prog.attempts!==1?"s":""}</div></>:<span style={S.tag(d.color)}>NEW</span>}
              </div>
            </div>
            <div style={{marginTop:10}}><ProgressBar pct={pct} color={d.color}/></div>
          </div>
        );
      })}
    </div></div>
  );
}

function DailyScreen({dp,setScreen,setQuizState}){
  const attempted=DOMAINS.filter(d=>dp[d.id]);
  const available=attempted.length>0?attempted:DOMAINS.slice(0,1);
  function startDaily(domains){
    const wq=save.weakQuestions||{};
    const weakKeys=new Set(Object.keys(wq));
    const pool=domains.flatMap(d=>d.questions.map(q=>({...q,domainId:d.id,domainName:d.name,domainColor:d.color})));
    const weakPool=shuffle(pool.filter(q=>weakKeys.has(q.q.slice(0,40))));
    const regularPool=shuffle(pool.filter(q=>!weakKeys.has(q.q.slice(0,40))));
    const picked=shuffle([...weakPool.slice(0,7),...regularPool.slice(0,Math.max(3,10-weakPool.length))]).slice(0,10);
    setQuizState({mode:"daily",questions:picked,qIdx:0,answers:[],score:0,confidence:[],domainIds:domains.map(d=>d.id)});
    setScreen("dailyQuiz");
  }
  return(
    <div style={S.app}><div style={S.scan}/>
    <div style={S.wrap}>
      <BackBtn onClick={()=>setScreen("home")} color={C.gold}/>
      <div style={S.label(C.gold)}>Daily Quick Practice</div>
      <div style={{...S.card(),marginBottom:20,fontSize:12,color:C.dim,lineHeight:1.7}}>10 randomized questions from completed domains. Pick a focus or run everything for maximum coverage.</div>
      <div style={S.label()}>Pick Your Focus</div>
      <div style={{...S.card(C.gold),cursor:"pointer"}} onClick={()=>startDaily(available)}>
        <div style={{fontSize:13,color:C.gold,fontWeight:"bold",marginBottom:4}}>⚡ All Completed Domains</div>
        <div style={{fontSize:11,color:C.dim}}>{available.map(d=>d.name).join(", ")}</div>
      </div>
      {available.map(d=>{
        const prog=dp[d.id];const pct=prog?.bestScore||0;
        return(
          <div key={d.id} style={{...S.card(pct<80?d.color:C.border),cursor:"pointer"}} onClick={()=>startDaily([d])}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:13,color:d.color,fontWeight:"bold"}}>{d.icon} {d.name}</div><div style={{fontSize:11,color:C.dim,marginTop:3}}>{d.desc}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:"bold",color:scoreColor(pct)}}>{pct}%</div>{pct<80&&<div style={{fontSize:9,color:C.red,letterSpacing:1}}>NEEDS WORK</div>}</div>
            </div>
          </div>
        );
      })}
      {attempted.length===0&&<div style={{padding:"16px",color:C.dim,fontSize:12,textAlign:"center"}}>Complete at least one Domain Study session to unlock daily practice.</div>}
    </div></div>
  );
}

function PracticeGate({practiceUnlocked,dp,setScreen,setQuizState}){
  function startPractice(){
    const pool=[];
    [{d:1,n:21},{d:2,n:17},{d:3,n:15},{d:4,n:18},{d:5,n:19}].forEach(({d,n})=>{
      const dom=DOMAINS.find(x=>x.id===d);
      shuffle(dom.questions).slice(0,Math.min(n,dom.questions.length)).forEach(q=>pool.push({...q,domainId:dom.id,domainName:dom.name,domainColor:dom.color}));
    });
    setQuizState({mode:"practice",questions:shuffle(pool),qIdx:0,answers:[],score:0,confidence:[],startTime:Date.now()});
    setScreen("practiceQuiz");
  }
  return(
    <div style={S.app}><div style={S.scan}/>
    <div style={S.wrap}>
      <BackBtn onClick={()=>setScreen("home")} color={C.d4}/>
      {!practiceUnlocked?(
        <div style={{textAlign:"center",padding:"40px 20px"}}>
          <div style={{fontSize:48,marginBottom:16}}>🔒</div>
          <div style={{fontSize:18,color:C.d4,fontWeight:"bold",marginBottom:12,letterSpacing:2}}>PRACTICE TEST LOCKED</div>
          <div style={{fontSize:12,color:C.dim,lineHeight:1.8,marginBottom:24}}>Complete all 5 domain study sessions at least once to unlock the Full Practice Test.</div>
          <div style={S.divider}/>
          {DOMAINS.map(d=>(
            <div key={d.id} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontSize:18}}>{dp[d.id]?"✅":"⬜"}</div>
              <div style={{fontSize:12,color:dp[d.id]?C.green:C.dim}}>{d.name}</div>
              {dp[d.id]&&<div style={{marginLeft:"auto",fontSize:11,color:scoreColor(dp[d.id].bestScore)}}>{dp[d.id].bestScore}%</div>}
            </div>
          ))}
        </div>
      ):(
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:12}}>🎯</div>
          <div style={{fontSize:18,color:C.d4,fontWeight:"bold",letterSpacing:2,marginBottom:8}}>FULL PRACTICE TEST</div>
          <div style={{fontSize:11,color:C.dim,letterSpacing:2,marginBottom:24}}>N10-009 SIMULATION</div>
          <div style={{display:"flex",justifyContent:"center",gap:28,marginBottom:28,flexWrap:"wrap"}}>
            {[["90","QUESTIONS"],["5","DOMAINS"],["~80%","PASSING"],["TIMED","SESSION"]].map(([v,l])=>(
              <div key={l} style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:"bold",color:C.d4}}>{v}</div><div style={{fontSize:9,color:C.dim,letterSpacing:1}}>{l}</div></div>
            ))}
          </div>
          <div style={{...S.card(),textAlign:"left",marginBottom:20}}>
            <div style={S.label(C.gold)}>After the test you get</div>
            <div style={{fontSize:12,color:C.dim,lineHeight:2}}>✓ Total score with pass/fail verdict<br/>✓ Domain-by-domain breakdown<br/>✓ Weak spot analysis with study tips<br/>✓ Confidence calibration report<br/>✓ Full answer review with analogies<br/>✓ AI-powered Explain it Differently on any miss</div>
          </div>
          <button onClick={startPractice} style={{...S.btn(C.d4,true),fontSize:13,padding:"13px 36px"}}>START PRACTICE TEST</button>
        </div>
      )}
    </div></div>
  );
}

function QuizScreen({quizState,setQuizState,save,updateSave,setScreen,mode}){
  const {questions,qIdx,answers,score,confidence}=quizState;
  const [selected,setSelected]=useState(null);
  const [confirmed,setConfirmed]=useState(false);
  const [conf,setConf]=useState(null);
  const [showRef,setShowRef]=useState(false);
  const [refQuery,setRefQuery]=useState("");
  const handleNextRef=useRef();
  const q=questions[qIdx];
  const color=q.domainColor||C.d1;
  const qDomainName=q.domainName||quizState.domain?.name||"";
  const total=questions.length;
  function getState(i){if(!confirmed)return selected===i?"selected":"default";if(i===q.answer)return "correct";if(i===selected&&selected!==q.answer)return "wrong";return "default";}
  async function handleNext(){
    const isCorrect=selected===q.answer;
    const newAnswers=[...answers,{qIdx,selected,correct:q.answer,confidence:conf}];
    const newScore=score+(isCorrect?1:0);
    const newConf=[...confidence,conf];
    const qKey=q.q.slice(0,40);
    const wq={...(save.weakQuestions||{})};
    if(!isCorrect){wq[qKey]={missed:(wq[qKey]?.missed||0)+1,correct:0};}
    else if(wq[qKey]){const s=(wq[qKey].correct||0)+1;if(s>=2){delete wq[qKey];}else{wq[qKey]={...wq[qKey],correct:s};}}
    if(qIdx+1<total){
      await updateSave({weakQuestions:wq});
      setQuizState({...quizState,qIdx:qIdx+1,answers:newAnswers,score:newScore,confidence:newConf});setSelected(null);setConfirmed(false);setConf(null);
    }else{
      const pct=Math.round((newScore/total)*100);
      const finalState={...quizState,answers:newAnswers,score:newScore,confidence:newConf,finalPct:pct,finishedAt:Date.now()};
      if(mode==="domain"){const dp=save.domainProgress||{};const prev=dp[quizState.domain.id]||{};await updateSave({weakQuestions:wq,domainProgress:{...dp,[quizState.domain.id]:{bestScore:Math.max(pct,prev.bestScore||0),attempts:(prev.attempts||0)+1,lastPct:pct}}});}
      else if(mode==="practice"){const hist=save.practiceHistory||[];await updateSave({weakQuestions:wq,practiceHistory:[...hist,{pct,date:Date.now(),total}]});}
      else{await updateSave({weakQuestions:wq});}
      setQuizState(finalState);setScreen("result");
    }
  }
  handleNextRef.current=handleNext;
  useEffect(()=>{
    function onKey(e){
      if(e.target.tagName==="INPUT")return;
      const map={"a":0,"b":1,"c":2,"d":3};
      if(confirmed){if(e.key==="Enter")handleNextRef.current?.();}
      else{
        const i=map[e.key.toLowerCase()];
        if(i!==undefined&&i<q.options.length)setSelected(i);
        if(e.key==="1")setConf("sure");
        if(e.key==="2")setConf("guess");
        if(e.key==="Enter"&&selected!==null&&conf!==null)setConfirmed(true);
      }
    }
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[confirmed,selected,conf,q.options.length]);
  return(
    <div style={S.app}><div style={S.scan}/>
    <div style={S.wrap}>
      {showRef&&(
        <div onClick={()=>setShowRef(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"var(--c-surface)",border:"1px solid var(--c-border)",borderRadius:20,padding:24,width:"100%",maxWidth:460,maxHeight:"75vh",display:"flex",flexDirection:"column",boxShadow:"0 8px 40px rgba(0,0,0,0.4)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div style={{fontSize:16,fontWeight:700,color:"var(--c-text)"}}>📖 Quick Reference</div>
              <button onClick={()=>setShowRef(false)} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:20,color:"var(--c-dim)",lineHeight:1}}>×</button>
            </div>
            <input
              autoFocus
              placeholder="Search acronyms and terms..."
              value={refQuery}
              onChange={e=>setRefQuery(e.target.value)}
              style={{width:"100%",padding:"10px 14px",background:"var(--c-bg)",border:"1px solid var(--c-border)",borderRadius:10,color:"var(--c-text)",fontSize:14,fontFamily:"inherit",marginBottom:14,outline:"none"}}
            />
            <div style={{overflowY:"auto",flex:1}}>
              {(()=>{
                const q=refQuery.trim().toLowerCase();
                if(!q) return <div style={{fontSize:13,color:"var(--c-dim)",textAlign:"center",padding:20}}>Type an acronym or keyword to look it up.</div>;
                const hits=FLASHCARD_DOMAINS.flatMap(fd=>fd.cards.map(c=>({...c,deckName:fd.name,deckColor:fd.color}))).filter(c=>c.term.toLowerCase().includes(q)||c.definition.toLowerCase().includes(q)||(c.acronym||"").toLowerCase().includes(q)).slice(0,6);
                if(!hits.length) return <div style={{fontSize:13,color:"var(--c-dim)",textAlign:"center",padding:20}}>No results for "{refQuery}"</div>;
                return hits.map((c,i)=>(
                  <div key={i} style={{padding:"12px 14px",border:"1px solid var(--c-border)",borderRadius:12,marginBottom:10,background:"var(--c-bg)"}}>
                    <div style={{fontSize:14,fontWeight:700,color:c.deckColor,marginBottom:4}}>{c.term}</div>
                    <div style={{fontSize:12,color:"var(--c-dim)",marginBottom:c.acronym?6:0,lineHeight:1.6}}>{c.definition}</div>
                    {c.acronym&&<div style={{fontSize:11,color:"#ffd166",lineHeight:1.6,paddingLeft:8,borderLeft:"2px solid #ffd166"}}>{c.acronym}</div>}
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <button onClick={()=>setScreen("home")} style={{...S.btn(C.dim),padding:"7px 14px",fontSize:13}}>✕ Exit</button>
        <div style={{fontSize:12,color:C.dim,fontWeight:500}}>{mode==="domain"?qDomainName:mode==="practice"?"Practice Test":"Daily Practice"}</div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>{setShowRef(true);setRefQuery("");}} title="Quick reference" style={{background:"transparent",border:`1px solid ${color}`,borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:16,color,fontFamily:"inherit"}}>📖</button>
          <div style={{fontSize:13,color,fontWeight:600}}>{qIdx+1}/{total}</div>
        </div>
      </div>
      <div style={{height:8,background:C.border,borderRadius:4,marginBottom:20,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${Math.round((qIdx/total)*100)}%`,background:color,transition:"width 0.3s",boxShadow:`0 0 8px ${color}`}}/>
      </div>
      <div style={{marginBottom:12}}>
        <span style={{...S.tag(color),marginRight:8}}>{qDomainName}</span>
        <span style={S.tag(C.muted)}>{q.topic}</span>
      </div>
      <div style={{fontSize:17,lineHeight:1.75,color:C.text,marginBottom:20,padding:"18px",background:C.surface,borderRadius:14,border:`1px solid ${C.border}`,fontWeight:500}}>{q.q}</div>
      {q.options.map((opt,i)=>(
        <button key={i} onClick={()=>{if(!confirmed)setSelected(i);}} style={S.optionBtn(getState(i),color)}>
          <span style={{marginRight:10,opacity:0.5}}>{String.fromCharCode(65+i)}.</span>{opt}
        </button>
      ))}
      <div style={{fontSize:10,color:C.muted,letterSpacing:1,textAlign:"center",margin:"6px 0"}}>A B C D &nbsp;select &nbsp;·&nbsp; 1 know it &nbsp;2 guess &nbsp;·&nbsp; Enter confirm</div>
      {!confirmed&&selected!==null&&(
        <div style={{marginTop:10,padding:"14px 16px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:12}}>
          <div style={S.label()}>How confident are you?</div>
          <button onClick={()=>setConf("sure")} style={{...S.btn(conf==="sure"?C.green:C.muted,conf==="sure"),width:"100%",marginBottom:10}}>✓ I Know This</button>
          <button onClick={()=>setConf("guess")} style={{...S.btn(conf==="guess"?C.orange:C.muted,conf==="guess"),width:"100%"}}>? Educated Guess</button>
        </div>
      )}
      {confirmed&&(
        <div style={{marginTop:14,padding:"14px 16px",background:`rgba(${hexRgb(color)},0.05)`,border:`1px solid ${color}`,borderRadius:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={S.label(color)}>Explanation</div>
            <div style={{fontSize:10,color:selected===q.answer?C.green:C.red,letterSpacing:2}}>{selected===q.answer?"CORRECT":"INCORRECT"}</div>
          </div>
          <div style={{fontSize:13,color:C.dim,lineHeight:1.85,marginBottom:16}}>{q.explanation}</div>
          <div style={{height:1,background:C.border,marginBottom:16}}/>
          <div style={{fontSize:11,color:color,letterSpacing:1,fontWeight:600,marginBottom:8}}>ANALOGY</div>
          <div style={{fontSize:13,color:C.text,lineHeight:1.85,paddingLeft:14,borderLeft:`3px solid ${color}`,marginBottom:16}}>{q.analogy}</div>
          <div style={{height:1,background:C.border,marginBottom:16}}/>
          <div style={{fontSize:11,color:C.green,letterSpacing:1,fontWeight:600,marginBottom:8}}>IN YOUR WORK</div>
          <div style={{fontSize:13,color:C.text,lineHeight:1.85,paddingLeft:14,borderLeft:`3px solid ${C.green}`}}>{q.realWorld}</div>
        </div>
      )}
      <div style={S.row}>
        {!confirmed
          ?<button onClick={()=>{if(selected!==null&&conf!==null)setConfirmed(true);}} disabled={selected===null||conf===null} style={{...S.btn(color,selected!==null&&conf!==null),opacity:selected===null||conf===null?0.4:1,flex:1}}>CONFIRM ANSWER</button>
          :<button onClick={handleNext} style={{...S.btn(color,true),flex:1}}>{qIdx+1<total?"NEXT QUESTION →":"SEE RESULTS"}</button>
        }
      </div>
      {!confirmed&&(selected===null||conf===null)&&(
        <div style={{textAlign:"center",fontSize:13,color:C.dim,marginTop:8}}>
          {selected===null?"👆 Select an answer to continue":"👆 Select your confidence level above"}
        </div>
      )}
    </div></div>
  );
}

function ResultScreen({quizState,setScreen,setQuizState,save,updateSave}){
  const {questions,answers,finalPct,mode,domain,startTime,finishedAt}=quizState;
  const total=questions.length;
  const correct=answers.filter(a=>a.selected===a.correct).length;
  const passed=finalPct>=80;
  const sc=scoreColor(finalPct);
  const sureTotal=answers.filter(a=>a.confidence==="sure").length;
  const sureCorrect=answers.filter(a=>a.confidence==="sure"&&a.selected===a.correct).length;
  const guessTotal=answers.filter(a=>a.confidence==="guess").length;
  const guessCorrect=answers.filter(a=>a.confidence==="guess"&&a.selected===a.correct).length;
  const calibPct=sureTotal>0?Math.round((sureCorrect/sureTotal)*100):null;
  const domainBreakdown=DOMAINS.map(d=>{
    const qs=answers.filter((_,i)=>questions[i]?.domainId===d.id);
    if(!qs.length)return null;
    const c=qs.filter(a=>a.selected===a.correct).length;
    return{domain:d,correct:c,total:qs.length,pct:Math.round((c/qs.length)*100)};
  }).filter(Boolean);
  const topicMap={};
  answers.forEach((a,i)=>{const q=questions[i];if(!q)return;if(!topicMap[q.topic])topicMap[q.topic]={correct:0,total:0,domain:q.domainName};topicMap[q.topic].total++;if(a.selected===a.correct)topicMap[q.topic].correct++;});
  const weakTopics=Object.entries(topicMap).map(([t,d])=>({topic:t,pct:Math.round((d.correct/d.total)*100),domain:d.domain,total:d.total})).filter(t=>t.pct<80).sort((a,b)=>a.pct-b.pct).slice(0,5);
  const tips={"OSI Model":"Re-watch Professor Messer's OSI model section. Use Please Do Not Throw Sausage Pizza Away bottom-up to memorize layer order.","IP Addressing":"Practice subnetting. Aim to subnet a /24 in under 30 seconds. The flashcard deck covers all private ranges and APIPA.","Protocols & Ports":"Make flashcards for the 20 most critical ports. The Ports and Protocols deck in this app covers all of them.","Switching":"Review MAC address table operation and STP port states: blocking, listening, learning, forwarding.","VLANs":"Draw a diagram with two VLANs and trace how a frame moves through a trunk port with 802.1Q tags.","Routing":"Know RIP (hop count), OSPF (cost), EIGRP (composite metric). BGP is for internet routing between ISPs.","Wireless":"Memorize the 802.11 table: a=5GHz/54M, b=2.4/11M, g=2.4/54M, n=dual/600M, ac=5GHz/3.5G. Use the Wireless deck.","Cables":"Know the 100m copper limit and the SMF vs MMF difference. Practice identifying connectors visually.","Attacks":"Study DoS, DDoS, MitM, ARP spoofing, DNS poisoning, phishing, brute force, replay, VLAN hopping.","AAA":"RADIUS = UDP, combines auth+authz in one packet. TACACS+ = TCP, separates all three AAA functions.","Firewalls":"Know all four types by OSI layer. NGFW = Layer 7 deep packet inspection. Stateful = tracks connection state.","IDS/IPS":"IDS = out-of-band, detect and alert only. IPS = inline, detect and block. Both can be signature or anomaly-based.","Wireless Security":"WEP broken, WPA/TKIP deprecated, WPA2/AES current, WPA3/SAE latest. Enterprise uses 802.1X with RADIUS.","Methodology":"All 7 steps: Identify, Theory, Test, Plan, Implement, Verify, Document, Prevent. Never skip step 1.","Tools":"ping (ICMP), tracert (path hops), nslookup (DNS), ipconfig (IP/DHCP), Wireshark (packet capture).","Cable Issues":"Attenuation = signal loss. Crosstalk = pair bleed. EMI = external interference. OTDR tests fiber.","Monitoring":"SNMP: 161=polling, 162=traps. SNMPv3=encrypted. Syslog=514. NTP=123. All exam favorites.","Availability":"RTO = max downtime budget. RPO = max data loss budget. MTTR = average repair time. MTBF = average uptime between failures.","QoS":"DSCP marks packets at Layer 3. Voice needs less than 150ms latency and less than 30ms jitter.","Documentation":"Network diagrams, change management, IPAM, cable labels, and runbooks are all exam topics.","Troubleshooting":"Practice the 7-step methodology on real tickets. Scenario questions test which step comes next.","Encryption":"TLS 1.2 and 1.3 are current. SSL and TLS 1.0/1.1 are deprecated. AES = symmetric. RSA = asymmetric key exchange.","NAT":"PAT (Port Address Translation) = many-to-one NAT using port numbers. What your home router does.","Cloud Concepts":"IaaS = rent hardware. PaaS = rent platform. SaaS = rent software. Know public, private, hybrid, community models.","PoE":"802.3af = 15.4W. 802.3at = 30W. 802.3bt = 60-100W. Higher-power APs and cameras need at or bt.","Least Privilege":"Related: need-to-know, separation of duties, job rotation, mandatory vacations. All reduce insider risk.","Network Zones":"DMZ between two firewalls. Internal = private LAN. Extranet = internal plus trusted partners."};
  const timeTaken=startTime&&finishedAt?Math.round((finishedAt-startTime)/1000):null;
  return(
    <div style={S.app}><div style={S.scan}/>
    {passed&&<Celebration/>}
    <div style={S.wrap}>
      <div style={{textAlign:"center",padding:"28px 16px 20px"}}>
        <div style={{fontSize:10,color:C.dim,letterSpacing:3,marginBottom:8}}>{mode==="practice"?"PRACTICE TEST COMPLETE":mode==="daily"?"DAILY PRACTICE COMPLETE":`DOMAIN ${domain?.id||""} COMPLETE`}</div>
        <div style={{fontSize:68,fontWeight:"bold",color:sc,textShadow:`0 0 32px ${sc}`,lineHeight:1}}>{finalPct}%</div>
        <div style={{fontSize:13,color:C.dim,marginTop:8}}>{correct} / {total} correct</div>
        {timeTaken&&<div style={{fontSize:11,color:C.dim,marginTop:4}}>Time: {Math.floor(timeTaken/60)}m {timeTaken%60}s</div>}
        <div style={{fontSize:14,color:sc,letterSpacing:3,marginTop:10,fontWeight:"bold"}}>{passed?"✓ PASSING":"✗ NEEDS WORK"}</div>
      </div>
      <div style={S.divider}/>
      {domainBreakdown.length>1&&(
        <div style={{marginBottom:20}}>
          <div style={S.label()}>Domain Breakdown</div>
          {domainBreakdown.map(({domain:d,correct:c,total:t,pct})=>(
            <div key={d.id} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <div style={{fontSize:12,color:d.color}}>{d.icon} {d.name}</div>
                <div style={{fontSize:12,color:scoreColor(pct),fontWeight:"bold"}}>{pct}% ({c}/{t})</div>
              </div>
              <ProgressBar pct={pct} color={d.color}/>
            </div>
          ))}
        </div>
      )}
      {sureTotal>0&&(
        <div style={{...S.card(),marginBottom:16}}>
          <div style={S.label(C.gold)}>Confidence Calibration</div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:11,color:C.dim,marginBottom:4}}>When you said I Know This</div>
              <div style={{fontSize:20,fontWeight:"bold",color:calibPct>=80?C.green:C.orange}}>{calibPct}%</div>
              <div style={{fontSize:11,color:C.dim}}>{sureCorrect}/{sureTotal} questions</div>
              {calibPct<80&&<div style={{fontSize:11,color:C.orange,marginTop:4}}>Review your wrong-but-confident answers first.</div>}
            </div>
            {guessTotal>0&&<div style={{flex:1}}>
              <div style={{fontSize:11,color:C.dim,marginBottom:4}}>When you said Educated Guess</div>
              <div style={{fontSize:20,fontWeight:"bold",color:scoreColor(Math.round(guessCorrect/guessTotal*100))}}>{Math.round(guessCorrect/guessTotal*100)}%</div>
              <div style={{fontSize:11,color:C.dim}}>{guessCorrect}/{guessTotal} questions</div>
            </div>}
          </div>
        </div>
      )}
      {weakTopics.length>0&&(
        <div style={{...S.card(),marginBottom:16}}>
          <div style={S.label(C.red)}>Weak Spots Detected</div>
          {weakTopics.map(t=>(
            <div key={t.topic} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <div><span style={{fontSize:12,color:C.text}}>{t.topic}</span><span style={{fontSize:10,color:C.dim,marginLeft:8}}>{t.domain}</span></div>
                <span style={{fontSize:12,color:scoreColor(t.pct),fontWeight:"bold"}}>{t.pct}%</span>
              </div>
              <ProgressBar pct={t.pct} color={scoreColor(t.pct)}/>
              {tips[t.topic]&&<div style={{fontSize:11,color:C.dim,lineHeight:1.7,marginTop:6,paddingLeft:8,borderLeft:`2px solid ${C.muted}`}}>{tips[t.topic]}</div>}
            </div>
          ))}
        </div>
      )}
      {mode==="practice"&&(
        <div style={{...S.card(passed?C.green:C.orange),marginBottom:16}}>
          <div style={S.label(passed?C.green:C.orange)}>Exam Readiness Verdict</div>
          {passed
            ?<div style={{fontSize:12,color:C.dim,lineHeight:1.8}}>Strong result. You are at exam-passing level. Run 2-3 more practice tests to confirm consistency before booking your exam date.</div>
            :<div style={{fontSize:12,color:C.dim,lineHeight:1.8}}>Not there yet — but this is why you practice. Target the weak spots above. One flashcard drill session plus one domain retry per weak area, then retake.</div>
          }
        </div>
      )}
      <div style={S.row}>
        <button onClick={()=>setScreen("review")} style={{...S.btn(C.d1,true),flex:1}}>REVIEW ALL ANSWERS</button>
      </div>
      <div style={{...S.row,marginTop:8}}>
        <button onClick={()=>setScreen("home")} style={{...S.btn(C.dim),flex:1}}>HOME</button>
        {mode==="domain"&&<button onClick={()=>{setQuizState({...quizState,qIdx:0,answers:[],score:0,confidence:[]});setScreen("domainQuiz");}} style={{...S.btn(quizState.domain?.color||C.d1),flex:1}}>RETRY</button>}
        {mode==="practice"&&<button onClick={()=>setScreen("practiceGate")} style={{...S.btn(C.d4),flex:1}}>RETAKE</button>}
        {mode==="daily"&&<button onClick={()=>setScreen("daily")} style={{...S.btn(C.gold),flex:1}}>NEW DAILY</button>}
      </div>
    </div></div>
  );
}

function ReviewScreen({quizState,setScreen}){
  const {questions,answers}=quizState;
  const [idx,setIdx]=useState(0);
  const q=questions[idx];
  const a=answers[idx];
  const isCorrect=a?.selected===a?.correct;
  const total=questions.length;
  const wrongIdxs=answers.map((a,i)=>a.selected!==a.correct?i:-1).filter(i=>i>=0);
  const color=q.domainColor||C.d1;
  return(
    <div style={S.app}><div style={S.scan}/>
    <div style={S.wrap}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <button onClick={()=>setScreen("result")} style={{...S.btn(color),padding:"4px 12px",fontSize:10}}>← RESULTS</button>
        <div style={{fontSize:11,color:C.dim,letterSpacing:2}}>REVIEW {idx+1}/{total}</div>
        <div style={{fontSize:11,color:C.red}}>{wrongIdxs.length} missed</div>
      </div>
      {wrongIdxs.length>0&&(
        <div style={{marginBottom:14}}>
          <div style={S.label(C.red)}>Jump to Missed</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {wrongIdxs.map(i=>(
              <button key={i} onClick={()=>setIdx(i)} style={{...S.btn(i===idx?C.red:C.muted,i===idx),padding:"3px 10px",fontSize:10}}>Q{i+1}</button>
            ))}
          </div>
        </div>
      )}
      <div style={{...S.card(isCorrect?C.green:C.red)}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <div><span style={S.tag(color)}>{q.domainName||""}</span><span style={{...S.tag(C.muted),marginLeft:6}}>{q.topic}</span></div>
          <div style={{fontSize:11,letterSpacing:2,color:isCorrect?C.green:C.red,fontWeight:"bold"}}>{isCorrect?"CORRECT":"WRONG"}</div>
        </div>
        <div style={{fontSize:14,lineHeight:1.7,color:C.text,marginBottom:16}}>{q.q}</div>
        {q.options.map((opt,i)=>(
          <div key={i} style={{padding:"10px 14px",marginBottom:8,borderRadius:6,border:`1px solid ${i===q.answer?C.green:i===a?.selected&&i!==q.answer?C.red:C.border}`,background:i===q.answer?`rgba(${hexRgb(C.green)},0.08)`:i===a?.selected&&i!==q.answer?`rgba(${hexRgb(C.red)},0.08)`:"transparent",color:i===q.answer?C.green:i===a?.selected&&i!==q.answer?C.red:C.dim,fontSize:13}}>
            {i===q.answer?"✓ ":i===a?.selected&&i!==q.answer?"✗ ":"  "}{opt}
          </div>
        ))}
        {a?.confidence&&<div style={{fontSize:11,color:C.muted,marginBottom:10}}>You answered: <span style={{color:a.confidence==="sure"?(isCorrect?C.green:C.red):C.orange}}>{a.confidence==="sure"?"I Know This":"Educated Guess"}</span>{a.confidence==="sure"&&!isCorrect&&<span style={{color:C.red}}> — overconfidence flag</span>}</div>}
        <div style={{padding:"12px 14px",background:`rgba(${hexRgb(color)},0.05)`,border:`1px solid ${color}`,borderRadius:8,marginBottom:10}}>
          <div style={S.label(color)}>Explanation</div>
          <div style={{fontSize:13,color:C.dim,lineHeight:1.85,marginBottom:16}}>{q.explanation}</div>
          <div style={{height:1,background:C.border,marginBottom:16}}/>
          <div style={{fontSize:11,color:color,letterSpacing:1,fontWeight:600,marginBottom:8}}>ANALOGY</div>
          <div style={{fontSize:13,color:C.text,lineHeight:1.85,paddingLeft:14,borderLeft:`3px solid ${color}`,marginBottom:16}}>{q.analogy}</div>
          <div style={{height:1,background:C.border,marginBottom:16}}/>
          <div style={{fontSize:11,color:C.green,letterSpacing:1,fontWeight:600,marginBottom:8}}>IN YOUR WORK</div>
          <div style={{fontSize:13,color:C.text,lineHeight:1.85,paddingLeft:14,borderLeft:`3px solid ${C.green}`}}>{q.realWorld}</div>
        </div>
      </div>
      <div style={S.row}>
        {idx>0&&<button onClick={()=>setIdx(i=>i-1)} style={{...S.btn(color),flex:1}}>← PREV</button>}
        {idx<total-1&&<button onClick={()=>setIdx(i=>i+1)} style={{...S.btn(color,true),flex:1}}>NEXT →</button>}
        {idx===total-1&&<button onClick={()=>setScreen("result")} style={{...S.btn(color,true),flex:1}}>DONE</button>}
      </div>
    </div></div>
  );
}
