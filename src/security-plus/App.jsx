import { useState, useEffect, useRef } from "react";
import { useTheme } from "../useTheme.js";

const C = {
  bg:"var(--c-bg)", surface:"var(--c-surface)", border:"var(--c-border)", muted:"var(--c-muted)",
  text:"var(--c-text)", dim:"var(--c-dim)", d1:"#00b4d8", d2:"#f77f00", d3:"#4cc9f0",
  d4:"#e63946", d5:"#06d6a0", gold:"#ffd166", green:"#06d6a0", red:"#e63946",
  orange:"#f77f00", purple:"#9b5de5",
};
function hexRgb(hex){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return `${r},${g},${b}`;}
function scoreColor(p){return p>=80?C.green:p>=65?C.orange:C.red;}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const SK="secplus-v1";
const hasStorageShim=typeof window.storage?.get==="function"&&typeof window.storage?.set==="function";
async function loadSave(){try{let raw=null;if(hasStorageShim){const r=await window.storage.get(SK);raw=r?.value??null;}else{raw=localStorage.getItem(SK);}if(!raw)return{};const p=JSON.parse(raw);return(p&&typeof p==="object"&&!Array.isArray(p))?p:{};}catch{}return{};}
async function writeSave(d){try{if(hasStorageShim)await window.storage.set(SK,JSON.stringify(d));else localStorage.setItem(SK,JSON.stringify(d));}catch{}}

const FLASHCARD_DOMAINS=[
  {id:"fc1",name:"Cryptography & PKI",color:C.d1,icon:"🔑",cards:[
    {term:"Symmetric vs Asymmetric Encryption",definition:"Symmetric: same key encrypts and decrypts (AES, 3DES). Fast, used for bulk data. Asymmetric: public key encrypts, private key decrypts (RSA, ECC). Slower, used for key exchange and signatures.",acronym:"Symmetric = Same key. Asymmetric = Apart keys (public/private pair). AES = symmetric speed demon. RSA = asymmetric key negotiator.",analogy:"Symmetric is a house key — one key locks and unlocks. Asymmetric is a mailbox — anyone can drop mail in (public key), only you can retrieve it (private key).",category:"Cryptography"},
    {term:"AES (Advanced Encryption Standard)",definition:"Symmetric block cipher. Key sizes: 128, 192, or 256 bits. Current US government standard. Replaces DES and 3DES. Used in WPA2, BitLocker, TLS.",acronym:"AES = Always Encrypts Securely. 128/192/256-bit keys. The gold standard for symmetric encryption.",analogy:"AES is the bank vault lock of encryption — industry standard, well-tested, trusted by governments worldwide.",category:"Algorithms"},
    {term:"RSA",definition:"Asymmetric algorithm based on the difficulty of factoring large prime numbers. Common key sizes: 2048 or 4096 bits. Used for key exchange, digital signatures, and encrypting small data.",acronym:"RSA = Rivest-Shamir-Adleman. Too slow for bulk data — used to exchange symmetric keys, not encrypt files.",analogy:"RSA is the handshake that establishes trust. Once trust is established, you switch to AES for the actual conversation.",category:"Algorithms"},
    {term:"Hashing vs Encryption",definition:"Hashing is one-way — produces a fixed-length digest, cannot be reversed. Encryption is two-way — encrypted data can be decrypted with the right key. Hashing verifies integrity; encryption ensures confidentiality.",acronym:"Hash = one-way fingerprint. Encrypt = two-way lockbox. MD5/SHA = hashing. AES/RSA = encryption.",analogy:"Hashing is running meat through a grinder — you can verify it came from a specific animal but can't reassemble the animal. Encryption is putting meat in a locked container — open the lock, get the meat back.",category:"Cryptography"},
    {term:"SHA-256 and SHA-3",definition:"SHA (Secure Hash Algorithm) family produces fixed-length digests. SHA-256 produces a 256-bit hash. SHA-3 uses a different design (Keccak sponge). Both used for file integrity and digital signatures.",acronym:"SHA-256 = 256-bit hash. MD5 is deprecated (collision attacks). SHA-1 is deprecated. Use SHA-256 or higher.",analogy:"SHA-256 is a fingerprint scanner with 256-bit precision. Two different inputs never produce the same fingerprint (in practice).",category:"Algorithms"},
    {term:"PKI (Public Key Infrastructure)",definition:"Framework for issuing, managing, and revoking digital certificates. Components: CA (issues certs), RA (validates identities), CRL (revoked cert list), OCSP (real-time revocation check), certificate repository.",acronym:"PKI = CA + RA + CRL + OCSP. CA = Certificate Authority. CRL = Certificate Revocation List. OCSP = Online Certificate Status Protocol.",analogy:"PKI is the DMV for digital identities. The CA is the DMV that issues licenses (certificates), CRL is the list of revoked licenses, OCSP is the cop who checks your license is still valid in real time.",category:"PKI"},
    {term:"Digital Signatures",definition:"Created by hashing data and encrypting the hash with the sender's private key. Recipients decrypt with the sender's public key and verify the hash matches. Provides authentication, integrity, and non-repudiation.",acronym:"Sign = hash + encrypt with PRIVATE key. Verify = decrypt with PUBLIC key + compare hash. Non-repudiation = can't deny sending it.",analogy:"A digital signature is a wax seal that only your ring (private key) can create, but anyone can verify it's yours (public key). Breaking the seal means the document was tampered.",category:"PKI"},
    {term:"Perfect Forward Secrecy (PFS)",definition:"Key exchange method where session keys are generated fresh for each session and not derived from the server's private key. If the private key is ever compromised, past sessions remain encrypted.",acronym:"PFS = ephemeral keys per session. TLS 1.3 requires PFS. Implemented via DHE or ECDHE key exchange.",analogy:"PFS is like using a new combination lock for every conversation and throwing away the combination after. Even if someone steals your master key, they can't open old locks.",category:"Cryptography"},
  ]},
  {id:"fc2",name:"Threats & Attack Types",color:C.d4,icon:"⚠️",cards:[
    {term:"Phishing vs Spear Phishing vs Whaling",definition:"Phishing: mass email attack targeting anyone. Spear phishing: targeted at a specific person or organization using personalized info. Whaling: spear phishing targeting executives (CEO, CFO).",acronym:"Phishing = casting a wide net. Spear = aimed at one fish. Whaling = hunting the biggest fish (executives).",analogy:"Phishing is sending the same scam letter to every address on a street. Spear phishing is a letter addressed specifically to you, referencing your job title and boss. Whaling is targeting the company CEO.",category:"Social Engineering"},
    {term:"Ransomware",definition:"Malware that encrypts victim files and demands cryptocurrency payment for the decryption key. Spreads via phishing emails, RDP exploits, or drive-by downloads. Defense: offline backups, patching, email filtering.",acronym:"Ransomware = encrypt + extort. No backup = pay or lose data. Air-gapped backups = your best defense.",analogy:"Ransomware is a digital kidnapper who locks your files in an encrypted safe and mails you a ransom note with a Bitcoin address.",category:"Malware"},
    {term:"SQL Injection",definition:"Attacker injects malicious SQL code into input fields that gets executed by the database. Can extract, modify, or delete data. Prevention: parameterized queries, input validation, least privilege on DB accounts.",acronym:"SQLi = inject SQL via user input. ' OR '1'='1 is the classic test string. Fix: parameterized queries, never concatenate user input into SQL.",analogy:"SQL injection is telling a librarian 'Find books by Author: Smith; DROP TABLE books;' — if the librarian blindly follows instructions, your whole library disappears.",category:"Application Attacks"},
    {term:"Cross-Site Scripting (XSS)",definition:"Attacker injects malicious JavaScript into a web page that executes in other users' browsers. Stored XSS saves the script in the database. Reflected XSS is delivered via a crafted URL. Prevention: output encoding, CSP headers.",acronym:"XSS = inject script into web pages. Stored = persists in DB. Reflected = in the URL. CSP header = browser defense.",analogy:"XSS is like slipping a note into a library book that gives the next reader a virus. The library (web server) is the vector, the victim is anyone who reads the infected page.",category:"Application Attacks"},
    {term:"Man-in-the-Middle (MitM) / On-Path Attack",definition:"Attacker intercepts communication between two parties, potentially reading or modifying traffic. Methods: ARP spoofing, rogue Wi-Fi AP, SSL stripping. Defense: encryption (TLS), certificate pinning, VPN.",acronym:"MitM = intercept + optionally modify. ARP spoofing enables LAN MitM. TLS prevents traffic reading. Certificate pinning prevents fake certs.",analogy:"MitM is a dishonest postal worker who opens your mail, reads or changes it, reseals it, and delivers it. Both parties think communication was private.",category:"Network Attacks"},
    {term:"DDoS Attack Types",definition:"Volumetric: flood bandwidth (UDP flood, ICMP flood). Protocol: exhaust stateful resources (SYN flood). Application layer: target application logic (HTTP flood, Slowloris). Defense: CDN scrubbing, rate limiting, anycast.",acronym:"DDoS = Distributed Denial of Service. 3 types: Volumetric (pipes), Protocol (state tables), Application (logic). Botnet = army of compromised hosts.",analogy:"Volumetric DDoS is flooding a highway with cars. Protocol attack is filling a parking garage. Application attack is having thousands of people call the same customer service line with complex questions.",category:"Network Attacks"},
    {term:"Social Engineering Techniques",definition:"Pretexting: fabricating a scenario to extract info. Tailgating/piggybacking: following authorized personnel through secure doors. Vishing: phone-based phishing. Smishing: SMS-based phishing. Baiting: leaving infected USB drives.",acronym:"PTVS-B: Pretexting, Tailgating, Vishing, Smishing, Baiting. All exploit human trust rather than technical vulnerabilities.",analogy:"Social engineering is the art of the con. A technically perfect lock means nothing if you convince someone to open it for you.",category:"Social Engineering"},
    {term:"Zero-Day Vulnerability",definition:"A software vulnerability unknown to the vendor with no available patch. Exploits for zero-days are highly valuable because defenders have zero days to patch before exploitation. Defense: defense-in-depth, behavioral detection.",acronym:"Zero-day = no patch exists yet. Day 1 = vendor learns about it. Day 0 = attacker already knew. Mitigate with layered defenses when patching isn't possible.",analogy:"A zero-day is a secret entrance to a building that the building owner doesn't know exists. You can't lock a door you don't know about.",category:"Vulnerabilities"},
  ]},
  {id:"fc3",name:"Network Security Controls",color:C.d2,icon:"🛡️",cards:[
    {term:"Firewall Types",definition:"Packet filter: stateless, checks headers. Stateful: tracks connection state. Application/proxy: inspects content. NGFW: Layer 7 deep packet inspection with app awareness. WAF: web application firewall filters HTTP/HTTPS.",acronym:"PSAN-W: Packet filter, Stateful, Application, NGFW, WAF. Each level reads deeper into the packet.",analogy:"Packet filter checks your ID at the gate. Stateful remembers you came in. NGFW reads your bag contents and your social media history.",category:"Firewalls"},
    {term:"IDS vs IPS",definition:"IDS (Intrusion Detection System): passive, monitors and alerts, out-of-band tap. IPS (Intrusion Prevention System): active, inline, detects and blocks. Both can be signature-based or anomaly/behavior-based.",acronym:"IDS = I Detect and Scream. IPS = I Prevent and Stop. Signature = known patterns. Anomaly = deviation from baseline.",analogy:"IDS is a smoke detector — loud alarm but doesn't fight the fire. IPS is a sprinkler system — detects AND douses automatically.",category:"Detection & Prevention"},
    {term:"DMZ (Demilitarized Zone)",definition:"Network segment between two firewalls hosting public-facing servers (web, mail, DNS). External firewall allows internet traffic in; internal firewall blocks DMZ from LAN. Compromise of DMZ doesn't equal LAN compromise.",acronym:"DMZ = middle zone. Public servers live here. Two firewalls = screened subnet. One firewall with 3 interfaces = also valid.",analogy:"DMZ is the lobby of a secure building. Visitors access the lobby (web server), but a second locked door (internal firewall) blocks the inner offices.",category:"Network Zones"},
    {term:"VPN Types",definition:"Site-to-site: connects two networks permanently over the internet (IPsec). Remote access: individual users connect to corporate network (SSL/TLS or IPsec). Split tunnel: only corporate traffic goes through VPN. Full tunnel: all traffic through VPN.",acronym:"Site-to-site = network-to-network. Remote access = user-to-network. Split tunnel = some through VPN. Full tunnel = all through VPN.",analogy:"A VPN is an armored tunnel through the public internet. Site-to-site is a permanent tunnel between two buildings. Remote access is a temporary tunnel a single car drives through.",category:"VPN"},
    {term:"Zero Trust Architecture",definition:"Never trust, always verify. No implicit trust based on network location. Every access request is authenticated, authorized, and continuously validated regardless of source (inside or outside the perimeter).",acronym:"Zero Trust = verify every request, every time. Microsegmentation + least privilege + MFA = zero trust in practice.",analogy:"Zero trust is an airport security model applied to your network. Even employees with badges must go through security every time — no one is trusted just because they're already inside.",category:"Architecture"},
    {term:"Network Access Control (NAC)",definition:"Enforces security policy before granting network access. Checks device compliance (patches, AV, OS version) before allowing connection. Non-compliant devices are quarantined or given limited access.",acronym:"NAC = check before connect. 802.1X is the IEEE standard for port-based NAC. RADIUS does the backend authentication.",analogy:"NAC is a health inspection for your device before it enters the kitchen (network). Fail the inspection and you wait in the waiting room (quarantine VLAN) until you're compliant.",category:"Access Control"},
    {term:"SIEM (Security Information and Event Management)",definition:"Aggregates and correlates logs from across the infrastructure in real time. Provides alerting, dashboards, and forensic search. Examples: Splunk, Microsoft Sentinel, IBM QRadar. SOAR adds automated response on top of SIEM.",acronym:"SIEM = collect + correlate + alert. SOAR = SIEM + automated playbook response. Log aggregation without correlation is just storage.",analogy:"SIEM is the air traffic control tower for your security team. It watches everything at once and alerts controllers (analysts) when flight paths conflict (attack patterns emerge).",category:"Monitoring"},
  ]},
  {id:"fc4",name:"Identity & Access Management",color:C.d5,icon:"🪪",cards:[
    {term:"Authentication Factors",definition:"Something you know: password, PIN. Something you have: smart card, token, phone. Something you are: biometrics (fingerprint, retina). Somewhere you are: geolocation. Something you do: behavioral biometrics. MFA requires 2+ different factor types.",acronym:"Know Have Are Where Do — five factor categories. MFA = Multi-Factor Authentication = 2+ DIFFERENT types. Two passwords = NOT MFA (same factor type).",analogy:"A door with a key (something you have) + keypad (something you know) is MFA. A door with two keyholes is just two locks, not two factors.",category:"Authentication"},
    {term:"Single Sign-On (SSO)",definition:"Authenticate once, access multiple systems without re-authenticating. Protocols: SAML (XML-based, browser), OAuth 2.0 (authorization delegation), OpenID Connect (authentication on top of OAuth). Reduces password fatigue.",acronym:"SSO = one login, many systems. SAML = enterprise SSO standard. OAuth = authorization (access on behalf). OIDC = authentication + OAuth.",analogy:"SSO is an all-access wristband at a festival. One check at the gate, then walk into any tent without showing ID again.",category:"SSO & Federation"},
    {term:"Privileged Access Management (PAM)",definition:"Controls, monitors, and audits privileged accounts (admin, root, service accounts). Features: just-in-time access, session recording, credential vaulting, least privilege enforcement. Reduces insider threat and blast radius.",acronym:"PAM = vault + monitor + least privilege for admin accounts. JIT = Just-In-Time access (temporary elevated rights).",analogy:"PAM is a gun safe for admin credentials — locked away, logged out when borrowed, and you're on camera the whole time you have it.",category:"Privileged Access"},
    {term:"RBAC vs ABAC vs MAC vs DAC",definition:"RBAC: access based on job role. ABAC: access based on attributes (department, time, device). MAC: access based on security labels (Top Secret, Secret) — government model. DAC: owner controls who gets access — most permissive.",acronym:"RBAC = Role. ABAC = Attribute. MAC = Mandatory (labels). DAC = Discretionary (owner decides). MAC is strictest, DAC is most flexible.",analogy:"RBAC is a keycard by job title. ABAC is a keycard that only works in Building A on weekdays. MAC is a clearance level — Top Secret can't share with Secret. DAC is letting your friend borrow your house key.",category:"Access Control Models"},
    {term:"Federated Identity",definition:"Allows users from one organization to access resources in another using their home credentials. Trust relationship between identity providers. Protocols: SAML, OAuth, OpenID Connect. Examples: 'Login with Google', enterprise partner portals.",acronym:"Federation = trust between identity providers. SAML = XML assertions. IdP = Identity Provider. SP = Service Provider.",analogy:"Federation is like using your driver's license (issued by your state) to rent a car in a different state — the rental company trusts your state's identity verification.",category:"SSO & Federation"},
    {term:"MFA and Passwordless",definition:"MFA combines two or more authentication factors. TOTP: time-based one-time password (Google Authenticator). FIDO2/WebAuthn: passwordless authentication using hardware keys or biometrics. Push notifications: approve login on your phone.",acronym:"TOTP = Time-based OTP, changes every 30 seconds. FIDO2 = phishing-resistant hardware authentication. Push MFA = phone approval notification.",analogy:"TOTP is like a secret decoder ring that changes every 30 seconds. FIDO2 is a physical security key — you can't phish something that never leaves your pocket.",category:"Authentication"},
  ]},
  {id:"fc5",name:"Incident Response & Forensics",color:C.purple,icon:"🔍",cards:[
    {term:"Incident Response Phases",definition:"1-Preparation: policies, tools, team. 2-Identification: detect and confirm incident. 3-Containment: short-term (isolate) + long-term (patch). 4-Eradication: remove malware, close vulnerability. 5-Recovery: restore systems. 6-Lessons Learned: document, improve.",acronym:"PICCERL or PICERL: Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned. NIST SP 800-61 is the reference framework.",analogy:"IR phases are like a house fire: Preparation (smoke detectors + extinguisher), Identification (fire!), Containment (close doors), Eradication (put it out), Recovery (rebuild), Lessons Learned (why did it start?).",category:"Incident Response"},
    {term:"Order of Volatility",definition:"Collect evidence from most volatile to least: CPU registers/cache → RAM → Swap/page file → Running processes → Network connections → Hard drive → Logs → Archived media. Volatile data is lost on power-off.",acronym:"Volatility order: Registers, RAM, Swap, Processes, Network, Disk, Logs, Archive. RAM first — it disappears when you power down.",analogy:"Order of volatility is like saving a sandcastle at high tide. Grab the most temporary structures first (RAM) before the wave (power-off) takes them forever.",category:"Forensics"},
    {term:"Chain of Custody",definition:"Documentation tracking who collected, handled, analyzed, and stored evidence. Must be unbroken from collection to court. Every person who touches evidence signs the log with time, date, and purpose.",acronym:"Chain of custody = documented evidence handling. Break it = evidence may be inadmissible. Hash the evidence at collection to prove integrity.",analogy:"Chain of custody is the evidence property receipt at a police station. Every hand the evidence passes through is logged — break the chain and a lawyer gets it thrown out.",category:"Forensics"},
    {term:"Forensic Imaging",definition:"Creating a bit-for-bit copy of storage media to preserve original evidence. Tools: dd (Linux), FTK Imager, Autopsy. Image is hashed (MD5/SHA-256) before and after to prove integrity. Work from the image, never the original.",acronym:"Image = bit-for-bit copy. Hash before and after = integrity proof. Work on the copy, preserve the original. Write blocker prevents contaminating the source.",analogy:"Forensic imaging is photocopying a crime scene. You work from the photocopy and keep the original behind glass — you can examine it a thousand times without disturbing the evidence.",category:"Forensics"},
    {term:"SOAR (Security Orchestration, Automation, and Response)",definition:"Automates repetitive SOC tasks using playbooks. When SIEM fires an alert, SOAR can automatically isolate a host, block an IP, create a ticket, and notify an analyst — without human intervention.",acronym:"SOAR = SIEM + automated playbooks. Reduces MTTD and MTTR. Frees analysts from repetitive tasks. Playbook = documented automated response procedure.",analogy:"SOAR is a robot that handles the routine emergency response — pulling the fire alarm, calling 911, and evacuating the building automatically while the human firefighters are still getting their gear on.",category:"Incident Response"},
    {term:"Threat Intelligence Sources",definition:"OSINT: publicly available info. ISAC: industry-specific threat sharing (FS-ISAC for finance). Dark web monitoring: credential leaks, malware sales. Threat feeds: STIX/TAXII format. Vendor advisories. Government sources: CISA, US-CERT.",acronym:"OSINT = Open Source Intelligence. ISAC = Information Sharing and Analysis Center. STIX = threat data format. TAXII = transport protocol for STIX.",analogy:"Threat intelligence is the neighborhood watch network for cybersecurity. ISACs are industry-specific watch groups — banks share info with banks, hospitals with hospitals.",category:"Threat Intelligence"},
  ]},
  {id:"fc6",name:"Risk & Compliance",color:C.gold,icon:"📋",cards:[
    {term:"Risk Treatment Options",definition:"Accept: acknowledge risk, take no action (cost > impact). Avoid: eliminate the activity causing the risk. Transfer: shift risk to a third party (insurance, contracts). Mitigate: implement controls to reduce likelihood or impact.",acronym:"AATM: Accept, Avoid, Transfer, Mitigate. Risk = Likelihood × Impact. Residual risk = risk remaining after controls.",analogy:"A car: Accept = drive without airbags (small risk). Avoid = don't drive. Transfer = buy insurance. Mitigate = install airbags and ABS.",category:"Risk Management"},
    {term:"BCP vs DRP",definition:"BCP (Business Continuity Plan): keeps critical business functions running during a disruption. DRP (Disaster Recovery Plan): restores IT systems after a disaster. BCP is broader; DRP is IT-focused. Both require testing (tabletop, walkthrough, simulation).",acronym:"BCP = keep the business running. DRP = restore IT. RTO = max downtime. RPO = max data loss. MTD = Maximum Tolerable Downtime.",analogy:"BCP is the hospital's emergency operations plan. DRP is specifically the IT department's plan to restore the medical records system after a flood.",category:"Business Continuity"},
    {term:"Data Classification Levels",definition:"Public: freely shareable. Internal/Private: for employees only. Confidential: sensitive business data, limited sharing. Restricted/Secret: highest protection, strict access controls. Government adds: Unclassified, CUI, Secret, Top Secret.",acronym:"Civilian: Public < Internal < Confidential < Restricted. Government: Unclassified < CUI < Secret < Top Secret. Classification drives access controls.",analogy:"Data classification is like mail stamping: a postcard (public), a sealed envelope (internal), a certified letter (confidential), or an armored courier (restricted).",category:"Data Governance"},
    {term:"Compliance Frameworks",definition:"PCI-DSS: payment card data. HIPAA: US health information. GDPR: EU personal data (right to be forgotten, 72-hour breach notification). SOC 2: service organization controls. ISO 27001: international ISMS standard. NIST CSF: US cybersecurity framework.",acronym:"PCI = payment cards. HIPAA = health data. GDPR = EU data. SOC 2 = service orgs. ISO 27001 = global ISMS. NIST CSF = identify/protect/detect/respond/recover.",analogy:"Compliance frameworks are industry-specific rulebooks. Just as restaurants follow health codes and banks follow banking regulations, IT follows data security regulations based on what data they handle.",category:"Compliance"},
    {term:"Third-Party Risk Management",definition:"Vendors and partners can introduce risk through shared access, data handling, or supply chain attacks. Controls: vendor risk assessments, questionnaires, right-to-audit clauses, SLAs, data processing agreements (DPAs). Supply chain attacks target software dependencies.",acronym:"TPRM = vendor risk management. Due diligence = assess before contracting. Right to audit = contract clause. Supply chain attack = compromise via vendor software update.",analogy:"Third-party risk is like hiring a contractor to renovate your kitchen. They have access to your house — you check references (due diligence) and make sure they're bonded (risk transfer) before giving them a key.",category:"Risk Management"},
    {term:"Security Awareness Training",definition:"Human layer defense. Content includes: phishing recognition, password hygiene, social engineering awareness, data handling policies, incident reporting. Phishing simulations measure and reinforce training effectiveness.",acronym:"Security awareness = train humans to be the last line of defense. Simulated phishing = measure click rates. Repeat training for failures.",analogy:"Security awareness training is a fire drill for cyberattacks. You practice before the real event so that when it happens, the response is muscle memory, not panic.",category:"Governance"},
  ]},
];

const DOMAINS=[
  {id:1,name:"General Security Concepts",weight:"12%",color:C.d1,icon:"🔐",desc:"Controls, cryptography, authentication, PKI, protocols",questions:[
    {topic:"Security Controls",q:"Which type of security control is specifically designed to PREVENT an attack from occurring?",options:["Detective","Corrective","Preventive","Compensating"],answer:2,explanation:"Preventive controls stop an attack before it happens (firewalls, encryption, access controls). Detective controls identify attacks in progress (IDS, logs). Corrective controls restore systems after an attack. Compensating controls substitute for a primary control.",analogy:"A preventive control is a lock on the door. A detective control is a security camera. A corrective control is calling the locksmith after the break-in. Compensating is hiring a guard when you can't install a lock.",realWorld:"When designing a security architecture, layer all four types. Prevention alone fails eventually — detection and correction are equally critical."},
    {topic:"Security Controls",q:"A company cannot immediately patch a known vulnerability. They implement additional monitoring on the affected system. This is an example of which control type?",options:["Preventive","Detective","Corrective","Compensating"],answer:3,explanation:"A compensating control is an alternative control used when the primary control cannot be implemented. Extra monitoring compensates for the inability to patch, reducing risk until the patch can be applied.",analogy:"If you can't fix a broken car window, you park in a well-lit garage — that's compensation. The real fix (the patch) is still the goal.",realWorld:"Compensating controls are common in legacy environments and documented in risk registers. They satisfy compliance requirements when primary controls are technically infeasible."},
    {topic:"Cryptography",q:"Which encryption algorithm is symmetric and is the current US government standard for protecting classified information?",options:["RSA","ECC","AES","SHA-256"],answer:2,explanation:"AES (Advanced Encryption Standard) is a symmetric block cipher approved by NIST. It uses 128, 192, or 256-bit keys and replaced DES/3DES as the US government standard. RSA and ECC are asymmetric. SHA-256 is a hash function.",analogy:"AES is the master padlock of symmetric encryption. RSA is the special handshake used to agree on which padlock to use before the conversation starts.",realWorld:"BitLocker, WPA2/3, TLS sessions, and encrypted storage all use AES under the hood. When a job posting says 'AES-256 encryption,' that's symmetric encryption of data at rest or in transit."},
    {topic:"Cryptography",q:"A user encrypts a file with a recipient's public key. What is needed to decrypt it?",options:["The same public key","The sender's private key","The recipient's private key","A shared symmetric key"],answer:2,explanation:"In asymmetric encryption, data encrypted with a public key can only be decrypted with the corresponding private key. The private key is never shared — it stays with its owner.",analogy:"A public key is a padlock you give to anyone. They lock a box (encrypt) and send it. Only you have the key (private key) that opens it.",realWorld:"This is the basis of secure email (S/MIME, PGP) and HTTPS certificate exchanges. Your browser encrypts the session key with the server's public key; only the server's private key can decrypt it."},
    {topic:"Authentication",q:"A user logs in with a password and then approves a push notification on their phone. How many authentication factors are in use?",options:["One factor","Two factors","Three factors","Four factors"],answer:1,explanation:"A password is 'something you know.' A phone push notification is 'something you have.' Two different factor types = MFA with two factors. Both from different categories qualifies as true MFA.",analogy:"A password plus phone approval is like a bank vault that needs your memorized combination (know) AND your physical key (have). Two factors, two different types.",realWorld:"Microsoft Authenticator, Duo, and Google Prompt are common push MFA tools. When an employee's password is phished, MFA is often the last line of defense."},
    {topic:"PKI",q:"Which PKI component provides real-time status of a certificate's validity without downloading the entire CRL?",options:["Certificate Authority (CA)","Certificate Revocation List (CRL)","OCSP (Online Certificate Status Protocol)","Registration Authority (RA)"],answer:2,explanation:"OCSP allows clients to query a responder for the revocation status of a specific certificate in real time. CRL is a downloadable list that can be large and outdated. OCSP is more efficient for real-time checks.",analogy:"CRL is downloading the entire no-fly list every time someone buys a ticket. OCSP is asking 'is this specific person on the no-fly list?' and getting an instant yes/no.",realWorld:"OCSP stapling improves TLS performance — the server includes a fresh OCSP response in the handshake so clients don't have to query the OCSP responder separately."},
    {topic:"Protocols",q:"Which protocol provides mutual authentication and encrypts all Kerberos traffic, and what is its maximum clock skew tolerance?",options:["LDAP — 10 minutes","Kerberos — 5 minutes","RADIUS — 30 minutes","TACACS+ — no time limit"],answer:1,explanation:"Kerberos uses tickets with timestamps. If the clocks between client and KDC differ by more than 5 minutes, authentication fails to prevent replay attacks. This is why NTP is critical in Active Directory environments.",analogy:"Kerberos tickets are like timed parking passes. If your watch is more than 5 minutes off, the parking attendant assumes your pass is fake.",realWorld:"A sudden wave of Kerberos authentication failures in an AD environment almost always points to an NTP sync problem on the domain controller."},
    {topic:"Zero Trust",q:"Which principle is MOST central to a Zero Trust architecture?",options:["Trust users inside the network perimeter","Verify every access request regardless of source location","Block all external traffic by default","Encrypt only data at rest"],answer:1,explanation:"Zero Trust operates on 'never trust, always verify.' Location inside the network perimeter grants no implicit trust. Every access request — internal or external — must be authenticated and authorized.",analogy:"Zero Trust is TSA security at every door in the airport, not just the entrance. Even airline employees go through screening every time.",realWorld:"Microsoft and Google moved to Zero Trust after high-profile breaches showed that perimeter-based trust fails when attackers get inside. Conditional Access policies in Azure AD are a Zero Trust implementation."},
    {topic:"Hashing",q:"Which statement correctly describes the purpose of hashing in a security context?",options:["Encrypts data so it can be decrypted later","Produces a fixed-length value to verify data integrity","Generates a public/private key pair","Compresses data for storage"],answer:1,explanation:"Hashing produces a fixed-length digest from input data. It is one-way (cannot be reversed) and used to verify integrity — the same input always produces the same hash. Even a one-character change produces a completely different hash.",analogy:"A hash is a fingerprint of data. You can verify a fingerprint matches, but you can't reconstruct the person from the fingerprint alone.",realWorld:"File integrity monitoring tools (Tripwire, OSSEC) hash system files at baseline and alert when hashes change. Software downloads include SHA-256 hashes so you can verify the file wasn't tampered with in transit."},
    {topic:"Security Controls",q:"Which of the following is an example of a PHYSICAL security control?",options:["Firewall rules","Intrusion detection system","Mantrap/access control vestibule","Security awareness training"],answer:2,explanation:"Physical controls protect physical access to assets. A mantrap (two interlocking doors requiring authentication between them) is a physical control. Firewalls and IDS are technical controls. Awareness training is an administrative/managerial control.",analogy:"Physical controls are the walls, doors, and locks. Technical controls are the alarm systems and cameras. Administrative controls are the policies that say 'don't leave the door open.'",realWorld:"Data centers layer all three: badge access + mantrap (physical), cameras + SIEM (technical), access policy + training (administrative). All three layers must be compromised for a full breach."},
    {topic:"Non-Repudiation & Digital Signatures",q:"A user digitally signs an email. Which cryptographic operation is performed to create the signature?",options:["The email is encrypted with the recipient's public key","The email is hashed, then the hash is encrypted with the sender's private key","The email is hashed, then the hash is encrypted with the sender's public key","The email is encrypted with a shared symmetric key"],answer:1,explanation:"A digital signature is created by hashing the message and then encrypting that hash with the sender's private key. The recipient decrypts it with the sender's public key and compares hashes to verify authenticity and integrity. Using the private key ensures non-repudiation — only the holder of the private key could have signed it. Option C is wrong because signing with a public key would let anyone create the signature.",analogy:"Signing an email is pressing your personal wax seal (private key) into the message. Anyone can verify the seal impression with your public stamp impression, but only your unique ring could have made it.",realWorld:"S/MIME and PGP use this exact process for signed email. When a court case involves digital communications, a valid digital signature proves who sent the message — the sender cannot later deny it."},
    {topic:"Key Exchange Protocols",q:"Which key exchange protocol allows two parties to establish a shared secret over an insecure channel without transmitting the secret itself, and is considered ephemeral when used in TLS 1.3?",options:["RSA key exchange","AES key wrapping","Diffie-Hellman Ephemeral (DHE) / ECDHE","Kerberos ticket exchange"],answer:2,explanation:"Diffie-Hellman (DH) allows two parties to independently compute the same shared secret using public values, without ever sending the secret across the wire. When ephemeral keys are generated fresh for each session (DHE or ECDHE), past sessions remain secure even if long-term keys are later compromised — this is Perfect Forward Secrecy. RSA key exchange sends the secret encrypted under the server's long-term key; if that key is later stolen, all past sessions can be decrypted.",analogy:"DH is like two strangers each mixing their private paint color into a shared base color — they both end up with the same final color, but an eavesdropper who only sees the shared base and the individual contributions can't determine the final mix.",realWorld:"TLS 1.3 mandates ECDHE and removed static RSA key exchange specifically to enforce Perfect Forward Secrecy for all sessions. When a web server certificate is compromised, ECDHE ensures historical HTTPS traffic cannot be retroactively decrypted."},
    {topic:"Certificate Types",q:"A company wants a single TLS certificate to secure both 'store.example.com' and 'api.example.com' without purchasing separate certificates for each subdomain. Which certificate type BEST meets this need?",options:["Domain Validation (DV) certificate","Extended Validation (EV) certificate","Wildcard certificate","Subject Alternative Name (SAN) certificate"],answer:3,explanation:"A SAN (Subject Alternative Name) certificate explicitly lists multiple fully qualified domain names (FQDNs) in the certificate, covering specific subdomains chosen at issuance. A wildcard certificate (*.example.com) covers all subdomains at one level but cannot mix different base domains. SAN certificates are the most flexible for securing a defined list of specific hostnames across multiple subdomains or even different domains.",analogy:"A SAN certificate is a hotel key card programmed for rooms 101, 205, and 312 specifically. A wildcard is a master key for all rooms on floor one — broader but less precise.",realWorld:"Major CDNs and cloud load balancers routinely issue SAN certificates covering dozens of hostnames. Google's certificate for google.com includes SANs for mail.google.com, docs.google.com, and many others — one certificate, many protected names."},
    {topic:"Salting & Password Hashing",q:"A database storing hashed passwords is stolen. An attacker finds that two users have identical hash values, revealing they share the same password. Which security technique would have PREVENTED this information disclosure?",options:["Using a stronger hashing algorithm such as SHA-512 instead of MD5","Encrypting the hashes with AES after computing them","Adding a unique random salt to each password before hashing","Requiring passwords of at least 12 characters"],answer:2,explanation:"A salt is a unique random value appended to each password before hashing. Even if two users choose the same password, their salts differ, producing entirely different hashes. Salting also defeats precomputed rainbow table attacks because the attacker would need a separate rainbow table for every possible salt value — computationally infeasible. A stronger algorithm alone doesn't prevent identical hashes for identical passwords.",analogy:"Salting is adding a unique fingerprint smudge to every piece of paper before photocopying. Two identical documents look different after photocopying because each has a different smudge — you can't tell they started the same.",realWorld:"Bcrypt, scrypt, and Argon2 automatically generate and store a unique salt per password. The 2012 LinkedIn breach leaked 6.5 million unsalted SHA-1 password hashes — within days, 90% were cracked using precomputed tables. Salting would have made this infeasible."},
    {topic:"Elliptic Curve Cryptography (ECC)",q:"Which advantage makes Elliptic Curve Cryptography (ECC) preferable to RSA for mobile and IoT devices?",options:["ECC is a symmetric algorithm, making it faster than any asymmetric option","ECC provides equivalent security to RSA with significantly smaller key sizes, reducing computational overhead","ECC does not require key exchange, eliminating handshake latency","ECC uses quantum-resistant algorithms, making it immune to future attacks"],answer:1,explanation:"ECC achieves the same cryptographic strength as RSA with much smaller keys — a 256-bit ECC key offers roughly the same security as a 3072-bit RSA key. Smaller keys mean faster computation, less power consumption, and lower memory use, which is critical for constrained devices like smartphones, smart cards, and IoT sensors. ECC is still asymmetric and still requires key exchange; it is not quantum-resistant.",analogy:"ECC is a sports car that achieves 200 mph with a 2-liter engine. RSA is a truck that hits the same speed but needs a 10-liter engine. Same destination, dramatically different resource consumption.",realWorld:"TLS 1.3 favors ECDHE over traditional DHE for this reason. Apple Pay, Android Pay, and smart card authentication (PIV cards) rely on ECC because the key operations complete in milliseconds even on constrained hardware."},
    {topic:"Authentication Protocols",q:"A network engineer needs to centralize authentication for network device administrative access and requires per-command authorization logging. Which protocol is MOST appropriate?",options:["RADIUS","TACACS+","LDAP","Kerberos"],answer:1,explanation:"TACACS+ (Terminal Access Controller Access-Control System Plus) separates authentication, authorization, and accounting into distinct processes and encrypts the entire payload. It supports per-command authorization, making it ideal for network device administration where you need granular control and full audit trails. RADIUS combines authentication and authorization, encrypts only the password, and is better suited for network access control (Wi-Fi, VPN). LDAP is a directory protocol, not an AAA protocol.",analogy:"RADIUS is a club bouncer who checks your ID and approves your entry in one step. TACACS+ is a military base with separate checkpoints for identity, role, and a logged record of every door you open.",realWorld:"Cisco devices use TACACS+ with a Cisco ISE or ACS server for admin access. Every CLI command an engineer runs is logged to the TACACS+ server — critical for change management audits and insider threat investigations."},
    {topic:"Access Control Models",q:"A government system classifies all data with sensitivity labels (Top Secret, Secret, Unclassified) and prevents users from reading data above their clearance level or writing data to a lower classification. Which access control model is this?",options:["Role-Based Access Control (RBAC)","Discretionary Access Control (DAC)","Mandatory Access Control (MAC)","Attribute-Based Access Control (ABAC)"],answer:2,explanation:"Mandatory Access Control (MAC) uses sensitivity labels assigned by the system administrator — not by data owners. Access is granted based on label comparison: users cannot read data above their clearance (no read-up) and cannot write to lower classifications to prevent data leakage (no write-down). This is the Bell-LaPadula model used in military and government systems. DAC lets data owners decide access. RBAC uses job roles. ABAC uses flexible attribute combinations.",analogy:"MAC is a vault with combination locks set by headquarters — employees use the vault but can never change the combination or share contents with someone who doesn't have the same clearance level.",realWorld:"SELinux implements MAC at the OS level. Government SIPRNet and SCIFs enforce MAC through both technical and physical controls. The key exam distinction: in MAC, the system administrator controls labels — individual data owners cannot override them."},
    {topic:"Steganography",q:"An attacker embeds secret command-and-control instructions inside a seemingly normal JPEG image posted to a public social media site. What technique is being used?",options:["Encryption","Obfuscation","Steganography","Digital watermarking"],answer:2,explanation:"Steganography conceals the existence of a message by hiding it within ordinary-looking carrier files — images, audio, video, or documents. Unlike encryption (which hides the content but reveals a message exists), steganography hides the fact that communication is occurring at all. Attackers use image steganography to exfiltrate data or receive C2 commands in ways that evade security tools looking for encrypted or unusual traffic.",analogy:"Encryption is writing in a foreign language — people know a message exists but can't read it. Steganography is hiding a note inside a birthday card — no one suspects there's a secret message at all.",realWorld:"APT groups use steganography to embed C2 URLs inside images hosted on legitimate cloud storage, bypassing URL filtering and firewall rules. Security tools like StegDetect and entropy analysis of image files are used to detect anomalous content."},
  ]},
  {id:2,name:"Threats, Vulnerabilities & Mitigations",weight:"22%",color:C.d4,icon:"⚠️",desc:"Malware, social engineering, application attacks, threat intelligence",questions:[
    {topic:"Malware",q:"Which malware type self-replicates across a network WITHOUT requiring a host file or user interaction?",options:["Virus","Worm","Trojan","Rootkit"],answer:1,explanation:"A worm self-propagates across networks by exploiting vulnerabilities, consuming bandwidth and resources. A virus requires a host file and user action. A Trojan disguises itself as legitimate software. A rootkit hides its presence after infection.",analogy:"A virus is a cold that spreads when someone sneezes on you (user action required). A worm is airborne — it spreads through the ventilation system without any direct contact.",realWorld:"WannaCry was a worm. It spread automatically across networks through the EternalBlue SMB exploit with no user clicks required. Unpatched SMB was the attack vector."},
    {topic:"Social Engineering",q:"An attacker sends a highly personalized email to the CFO of a company, referencing recent acquisitions and addressing them by name, to steal wire transfer credentials. This is BEST described as:",options:["Phishing","Spear phishing","Whaling","Vishing"],answer:2,explanation:"Whaling is spear phishing that specifically targets high-value executives (CEO, CFO, board members). The personalization and executive targeting are the distinguishing characteristics.",analogy:"Phishing is trawling with a wide net. Spear phishing is a targeted cast at one fish. Whaling is harpooning the biggest whale in the ocean.",realWorld:"BEC (Business Email Compromise) is frequently whaling — attackers research the target company on LinkedIn and forge executive emails authorizing fraudulent wire transfers. FBI reports billions in losses annually."},
    {topic:"Application Attacks",q:"An attacker enters ' OR '1'='1 into a login field and gains access without valid credentials. What attack is this?",options:["Cross-Site Scripting (XSS)","Buffer overflow","SQL injection","Directory traversal"],answer:2,explanation:"SQL injection manipulates database queries by injecting SQL code through input fields. ' OR '1'='1 makes the query always return true, bypassing authentication without valid credentials.",analogy:"SQL injection is telling a gatekeeper 'My name is John OR the door is always open.' A poorly designed system processes this logically and opens the door.",realWorld:"Prevention: always use parameterized queries (prepared statements). Never concatenate user input directly into SQL strings. Input validation is a secondary defense, not the primary fix."},
    {topic:"Application Attacks",q:"An attacker injects malicious JavaScript into a blog comment. When other users view the comment, the script runs in their browser and steals session cookies. This is:",options:["Reflected XSS","Stored XSS","DOM-based XSS","CSRF"],answer:1,explanation:"Stored XSS (persistent XSS) saves the malicious script in the server's database. It executes for every user who views the infected content. Reflected XSS is delivered via crafted URL and not stored.",analogy:"Stored XSS is a poisoned well — once the poison is in the water supply (database), everyone who drinks (views the page) is affected.",realWorld:"The Samy worm (2005) exploited stored XSS on MySpace to add 1 million friends in under 24 hours. CSP (Content Security Policy) headers are the primary modern defense."},
    {topic:"Network Attacks",q:"An attacker sends millions of SYN packets to a web server with spoofed source addresses, exhausting the server's half-open connection table. This is a:",options:["UDP flood","SYN flood","Smurf attack","DNS amplification attack"],answer:1,explanation:"A SYN flood is a protocol-layer DDoS attack that exhausts the server's TCP connection state table by sending SYN packets and never completing the three-way handshake. The server allocates resources for connections that never complete.",analogy:"A SYN flood is making thousands of restaurant reservations with fake phone numbers and never showing up. Every table (connection slot) is reserved but empty, and real customers can't get in.",realWorld:"SYN cookies are the primary server-side mitigation — the server doesn't allocate resources until the handshake completes. Upstream DDoS scrubbing (Cloudflare) is the network-level defense."},
    {topic:"Vulnerability Management",q:"A vulnerability scan finds a critical CVE on a production server. The security team calculates it has a high CVSS score but the server is not accessible from the internet. What risk treatment is MOST appropriate?",options:["Accept with no action","Immediately take the server offline","Prioritize patching based on context — high internal risk still warrants urgent action","Transfer risk to cyber insurance only"],answer:2,explanation:"CVSS scores measure severity in isolation. Context matters: network exposure, data sensitivity, and compensating controls affect actual risk. A high-CVSS vulnerability on an air-gapped server has lower real-world risk than one on an internet-facing server — but internal access still warrants prompt remediation.",analogy:"A fire in a sealed vault is less dangerous than a fire in a crowded hallway — the severity is the same but the context changes the urgency. CVSS is the fire intensity; context is where the fire is.",realWorld:"Risk-based vulnerability management prioritizes by CVSS + asset exposure + data classification. Patching everything at once is impossible; prioritization is the practical skill the exam tests."},
    {topic:"Threats",q:"An attacker leaves several USB drives labeled 'Q3 Salary Data' in a company's parking lot. Employees find and plug them in, infecting their workstations. This technique is called:",options:["Vishing","Tailgating","Baiting","Pretexting"],answer:2,explanation:"Baiting uses physical media (USB drives, CDs) or digital lures containing malware. The attacker relies on curiosity or greed to get victims to plug in the infected media.",analogy:"Baiting is leaving a poisoned apple on a park bench labeled 'Free Candy.' The attacker relies on human curiosity to deliver the payload.",realWorld:"The Stuxnet worm used infected USB drives as a vector to reach air-gapped Iranian nuclear facilities. Security awareness training specifically includes 'do not plug in found USB drives.'"},
    {topic:"Threats",q:"Which type of malware specifically evades detection by hiding its presence in the operating system, often modifying kernel functions?",options:["Spyware","Worm","Rootkit","Adware"],answer:2,explanation:"A rootkit operates at the kernel or boot level to hide malware processes, files, and registry entries from the OS and security tools. Rootkits are extremely difficult to detect and remove without offline scanning.",analogy:"A rootkit is a corrupt security guard who hides the criminals from inspection. The guard controls what the camera shows and what the alarm system reports.",realWorld:"Rootkit removal often requires booting from external media (live USB) to scan the drive offline — online scanning misses rootkits because the infected OS is controlling what the scanner sees."},
    {topic:"Attacks",q:"An attacker intercepts legitimate authentication tokens and replays them to gain unauthorized access hours later. What attack type is this?",options:["Pass-the-hash","Replay attack","Credential stuffing","Rainbow table attack"],answer:1,explanation:"A replay attack captures valid authentication data (tokens, session IDs) and retransmits them later to impersonate the legitimate user. Timestamps and nonces in protocols like Kerberos prevent replay attacks.",analogy:"A replay attack is recording someone's voice saying 'open sesame' and playing it back later. The system hears a valid voice and opens.",realWorld:"Session tokens without expiration are vulnerable to replay attacks. HTTPS, token expiration, and one-time nonces are standard mitigations. Kerberos's 5-minute clock tolerance is specifically to prevent replay."},
    {topic:"Vulnerabilities",q:"Which process involves simulating an attacker's actions with authorization to identify exploitable vulnerabilities in a system?",options:["Vulnerability scanning","Penetration testing","Threat modeling","Risk assessment"],answer:1,explanation:"Penetration testing (pen testing) actively attempts to exploit vulnerabilities using attacker techniques with explicit permission. Vulnerability scanning identifies and reports vulnerabilities passively. Threat modeling identifies potential threats before testing.",analogy:"Vulnerability scanning is a home inspector checking for code violations. Pen testing is hiring a professional burglar to actually try to break in and report how they did it.",realWorld:"Pen tests produce a report with exploitation evidence — not just CVEs. They demonstrate actual business risk, which is more convincing to executives than a list of CVSS scores."},
    {topic:"Fileless Malware",q:"An attacker executes malicious PowerShell commands that run entirely in memory and use built-in Windows tools like WMI and certutil to achieve persistence. No malicious files are written to disk. This is BEST described as:",options:["A rootkit attack","A fileless / living-off-the-land attack","A drive-by download","A macro virus"],answer:1,explanation:"Fileless malware (also called living-off-the-land, or LotL) runs entirely in memory and leverages legitimate, pre-installed OS tools — PowerShell, WMI, certutil, mshta — to execute malicious code. Because nothing is written to disk, traditional signature-based antivirus finds nothing to scan. Detection requires behavioral monitoring and memory analysis. A rootkit hides processes but typically requires disk components. A drive-by download delivers a file. A macro virus embeds in a document.",analogy:"Fileless malware is a burglar who uses your own keys, your own tools from your garage, and wears your clothes — no foreign fingerprints anywhere. Traditional security cameras (AV) don't flag someone who looks like the resident.",realWorld:"The 2017 Equifax breach involved fileless techniques. EDR tools like CrowdStrike detect LotL by monitoring PowerShell script block logging, process injection patterns, and anomalous WMI subscriptions — behaviors that don't leave traditional file artifacts."},
    {topic:"Business Email Compromise (BEC)",q:"An attacker monitors a company's email for weeks, then sends a convincing email appearing to come from the CEO to the finance director requesting an urgent wire transfer. The CEO's domain is spoofed perfectly. This attack is called:",options:["Spear phishing","Whaling","Business Email Compromise (BEC)","Pretexting"],answer:2,explanation:"Business Email Compromise (BEC) is a financially motivated social engineering attack where attackers impersonate executives, vendors, or trusted parties to authorize fraudulent financial transactions. BEC is distinct from whaling (targeting executives) in that BEC specifically targets financial processes — the goal is a wire transfer, gift card purchase, or payroll redirect. BEC often involves email account compromise or domain spoofing after an extended reconnaissance period.",analogy:"BEC is a heist where the thief studies your business processes for months, then calls the bank teller impersonating the bank manager with the right account numbers, the right authority tone, and the right timing to authorize the transfer.",realWorld:"The FBI reports BEC losses exceeding $50 billion globally. Defense layers include out-of-band verification for wire transfers (call the requester on a known phone number), DMARC/DKIM/SPF email authentication, and finance process controls requiring dual approval above threshold amounts."},
    {topic:"Supply Chain Attacks",q:"Attackers compromise a software company's build pipeline and insert malicious code into a legitimate software update. Customers who install the update unknowingly install the malware. This is BEST described as:",options:["A watering hole attack","A supply chain attack","A zero-day exploit","A Trojan horse"],answer:1,explanation:"A supply chain attack compromises a trusted third-party vendor, developer, or software provider to distribute malware to downstream customers who trust and install the product. The SolarWinds SUNBURST attack is the definitive example. A watering hole attack compromises a website the target visits. A zero-day exploits an unknown vulnerability. A Trojan disguises malicious software as legitimate — supply chain attacks go further by compromising the actual legitimate software.",analogy:"A supply chain attack is poisoning the water at the city treatment plant rather than poisoning individual water bottles. Every customer who trusts the 'clean' supply gets infected — and they have no reason to be suspicious.",realWorld:"SolarWinds (2020): attackers inserted SUNBURST backdoor into signed Orion software updates delivered to 18,000 organizations including US federal agencies. Defense: software bill of materials (SBOM), code signing verification, vendor security assessments, and monitoring for anomalous behavior from trusted software."},
    {topic:"Credential Stuffing vs Password Spraying",q:"An attacker obtains a breach database of 50 million username/password pairs from a social media site and systematically tries these credentials against a banking application. What attack technique is this?",options:["Password spraying","Brute force attack","Credential stuffing","Pass-the-hash"],answer:2,explanation:"Credential stuffing uses stolen username/password pairs from previous breaches and tests them against other services, exploiting password reuse. It is highly targeted with real credentials — very different from brute force (randomly guessing passwords) or password spraying (trying a few common passwords against many accounts). Credential stuffing succeeds because users reuse passwords across sites. Pass-the-hash uses captured NTLM hashes, not plaintext credentials.",analogy:"Credential stuffing is copying keys from a locksmith's stolen master key sheet and trying them on every house in the neighborhood — you're using real, specific keys, not guessing. Password spraying is trying 'Welcome1' on every door regardless of the occupant.",realWorld:"Have I Been Pwned (haveibeenpwned.com) aggregates breach data used in credential stuffing campaigns. Defense: MFA (renders stuffed credentials useless), breach monitoring services, and anomalous login detection (login from new country, IP velocity). Never reusing passwords eliminates the vector entirely."},
    {topic:"Cross-Site Request Forgery (CSRF)",q:"A victim is logged into their bank's website. They then visit a malicious site that silently sends an HTTP request to the bank, transferring funds using the victim's active session. What attack type is this?",options:["Stored Cross-Site Scripting (XSS)","SQL injection","Cross-Site Request Forgery (CSRF)","Clickjacking"],answer:2,explanation:"CSRF (Cross-Site Request Forgery) tricks an authenticated user's browser into making unauthorized requests to a trusted site using their active session cookie. The bank's server sees a valid session cookie and processes the request — it cannot distinguish whether the user or the malicious page initiated it. The primary defense is CSRF tokens — unique values embedded in legitimate forms that malicious sites cannot predict or read due to same-origin policy.",analogy:"CSRF is a forger who grabs your hand while you're asleep and presses it onto a check. The bank sees your real signature — they can't tell you were unconscious when it happened.",realWorld:"CSRF was responsible for high-profile attacks on web forums and e-commerce platforms. Modern frameworks (Django, Rails, Spring) include CSRF protection by default. The SameSite cookie attribute also mitigates CSRF by restricting cross-origin cookie transmission."},
    {topic:"DNS Poisoning",q:"An attacker corrupts a recursive DNS resolver's cache with a fraudulent DNS record, causing users who query that resolver to be directed to a malicious IP address instead of the legitimate server. This is called:",options:["DNS amplification attack","DNS hijacking via registrar compromise","DNS cache poisoning (Kaminsky attack)","BGP route hijacking"],answer:2,explanation:"DNS cache poisoning injects fraudulent DNS records into a resolver's cache. When users query the poisoned resolver, they receive malicious IP addresses — redirecting them to attacker-controlled servers without modifying the authoritative DNS records. The Kaminsky attack (2008) demonstrated a practical method for poisoning DNS caches at scale. DNSSEC (DNS Security Extensions) cryptographically signs DNS records, preventing poisoning by allowing resolvers to validate record authenticity.",analogy:"DNS cache poisoning is bribing the phone book printer to replace a restaurant's phone number with your competitor's number. Everyone using that phone book calls the wrong place without knowing the book was tampered with.",realWorld:"A 2010 cache poisoning attack redirected Brazilian ISP customers trying to reach banking sites to credential-harvesting pages. DNSSEC deployment prevents this — but adoption remains incomplete. DNS-over-HTTPS (DoH) provides transport confidentiality but doesn't address cache poisoning — DNSSEC does."},
    {topic:"Adversary-in-the-Middle (AiTM) Phishing",q:"An attacker hosts a reverse proxy that sits between a victim and their bank's legitimate login page. The victim successfully logs in and completes MFA, but the attacker captures the session cookie in real time and uses it to impersonate the victim. This is BEST described as:",options:["A replay attack using stolen session tokens","An Adversary-in-the-Middle (AiTM) phishing attack","A credential stuffing attack","A pass-the-hash attack"],answer:1,explanation:"AiTM phishing uses a reverse proxy to relay the victim's real authentication (including MFA completion) to the legitimate site while simultaneously capturing the post-authentication session cookie. The MFA step is defeated because the attacker isn't stealing credentials — they're hijacking the fully authenticated session. This bypasses traditional MFA protections. FIDO2/WebAuthn hardware keys are resistant because they bind authentication to the origin domain, making the phishing proxy's domain mismatch detectable.",analogy:"AiTM is a relay race where the baton (session cookie) is grabbed by a runner who wasn't supposed to be in the race. The finish line (bank server) only sees that the baton arrived — not who actually carried it across.",realWorld:"The EvilGinx2 and Modlishka frameworks are widely used AiTM proxies. Microsoft Threat Intelligence documented AiTM campaigns stealing session cookies from over 10,000 organizations in 2022. Conditional Access policies checking device compliance and FIDO2 keys are the primary mitigations."},
    {topic:"Indicators of Compromise (IoC) vs Indicators of Attack (IoA)",q:"A security analyst observes that a process on an endpoint is spawning PowerShell child processes, connecting to external IPs, and disabling Windows Defender — all before any known malware signature is detected. What type of indicator is the analyst using?",options:["Indicator of Compromise (IoC) — evidence that a breach already occurred","Indicator of Attack (IoA) — evidence of adversary behavior and intent in progress","Threat intelligence feed artifact","CVSS severity score"],answer:1,explanation:"Indicators of Attack (IoA) focus on adversary behaviors and tactics in real time — what the attacker is doing, not what they left behind. IoAs detect attacks before malware signatures exist. Indicators of Compromise (IoC) are forensic artifacts left after an attack: malicious file hashes, known malicious IPs, registry keys, C2 domain names. IoCs are reactive; IoAs are proactive. Behavior-based detection (EDR) identifies IoAs; signature-based detection identifies IoCs.",analogy:"IoC is finding muddy footprints after a burglary — evidence someone was there. IoA is watching someone rattling windows and testing door locks before they break in — catching the intent and behavior, not the aftermath.",realWorld:"EDR platforms like CrowdStrike and Microsoft Defender for Endpoint use IoA-based behavioral detection to stop novel malware with no existing signature. The MITRE ATT&CK framework catalogs adversary behaviors (TTPs) that map directly to IoAs — enabling detection of attacker methodology regardless of specific malware family."},
  ]},
  {id:3,name:"Security Architecture",weight:"18%",color:C.d2,icon:"🏗️",desc:"Network security, cloud security, infrastructure, resilience",questions:[
    {topic:"Network Segmentation",q:"Which network design principle places web servers accessible to the internet in a separate zone between two firewalls?",options:["VLAN segmentation","DMZ (screened subnet)","Zero Trust microsegmentation","Air gap"],answer:1,explanation:"A DMZ (Demilitarized Zone) sits between an external firewall (facing the internet) and an internal firewall (protecting the LAN). Public-facing servers live in the DMZ so their compromise doesn't directly expose the internal network.",analogy:"A DMZ is an airlock between deep space and the space station. External visitors (internet traffic) can enter the airlock (DMZ), but the inner hatch (internal firewall) stays sealed unless explicitly opened.",realWorld:"Web servers, email relays, and reverse proxies belong in the DMZ. If an attacker compromises the web server, the internal firewall limits lateral movement into the LAN."},
    {topic:"Cloud Security",q:"Which cloud security control acts as a proxy between users and cloud services, enforcing security policies such as DLP and access control?",options:["CSPM","CASB","WAF","SIEM"],answer:1,explanation:"A CASB (Cloud Access Security Broker) sits between users and cloud services, providing visibility, compliance, data security, and threat protection across cloud apps. CSPM manages cloud infrastructure misconfigurations. WAF protects web apps. SIEM aggregates logs.",analogy:"A CASB is a corporate travel agent who handles all cloud bookings — they enforce company policy on what services employees can use and what data they can send.",realWorld:"When a company wants to prevent employees from uploading sensitive files to personal Dropbox accounts, a CASB can detect and block this in real time by inspecting cloud traffic."},
    {topic:"Cloud Security",q:"In the cloud shared responsibility model, who is responsible for patching the operating system on an IaaS virtual machine?",options:["The cloud provider","The customer","Shared equally between provider and customer","A third-party managed service provider"],answer:1,explanation:"In IaaS, the cloud provider manages hardware, networking, and hypervisor. The customer manages everything above: OS, middleware, applications, and data. OS patching is always the customer's responsibility in IaaS.",analogy:"In IaaS, the cloud provider is the landlord who maintains the building structure. The tenant (customer) installs the appliances, locks the doors, and keeps the place clean.",realWorld:"Misunderstanding the shared responsibility model is a leading cause of cloud breaches. 'The cloud is secure' is true — but your OS, your application, your data configuration are your responsibility."},
    {topic:"VPN",q:"A company wants all remote employee traffic — both corporate and personal browsing — to route through the corporate VPN and security controls. Which VPN configuration achieves this?",options:["Split tunneling","Full tunneling","Site-to-site VPN","SSL portal VPN"],answer:1,explanation:"Full tunnel VPN routes ALL traffic through the VPN, enabling corporate security controls to inspect and filter all employee internet traffic. Split tunnel only routes corporate-destined traffic through the VPN.",analogy:"Full tunnel is driving all your deliveries through the company's loading dock for inspection. Split tunnel is sending company packages through the dock but personal packages straight to the customer.",realWorld:"Full tunnel provides better security visibility but higher latency for non-corporate traffic and increases VPN infrastructure load. Many companies use split tunnel for performance while relying on endpoint security for non-corporate traffic."},
    {topic:"Defense in Depth",q:"A security architect implements firewalls, IPS, endpoint protection, DLP, and security awareness training. This approach is BEST described as:",options:["Zero Trust","Defense in Depth","DMZ architecture","Least privilege"],answer:1,explanation:"Defense in Depth (layered security) deploys multiple overlapping security controls so that no single failure compromises the entire environment. Each layer provides protection if another fails.",analogy:"Defense in depth is a castle with a moat, outer wall, inner wall, armed guards, and locked keep. An attacker who breaches one layer still faces the next.",realWorld:"No single control is perfect. Defense in depth assumes that each control will eventually fail and ensures redundant protections. The exam frequently tests that a specific control is one layer, not a complete solution."},
    {topic:"Infrastructure",q:"Which type of proxy receives internet requests on behalf of clients, hiding internal IP addresses, and can provide content filtering and caching?",options:["Reverse proxy","Forward proxy","Transparent proxy","WAF"],answer:1,explanation:"A forward proxy sits between internal clients and the internet, making requests on their behalf. It hides client IPs, caches content, and enforces URL filtering. A reverse proxy sits in front of servers, protecting them from clients.",analogy:"A forward proxy is a librarian who retrieves books for patrons — the author never knows who actually wanted the book. A reverse proxy is a receptionist who takes messages for the CEO, hiding which exec actually responds.",realWorld:"Web filtering solutions (Cisco Umbrella, Zscaler) function as forward proxies. They inspect outbound traffic for malware downloads, block blacklisted URLs, and cache frequently accessed content."},
    {topic:"Resilience",q:"An organization implements redundant power supplies, RAID storage, and geographically distributed data centers. These are examples of which resilience concept?",options:["Encryption","High availability","Least privilege","Air gapping"],answer:1,explanation:"High availability uses redundant components (power supplies, RAID, multiple sites) to eliminate single points of failure and ensure continuous service. Redundancy is the mechanism; high availability is the goal.",analogy:"High availability is building a bridge with six load-bearing cables when two would be sufficient. Any four can fail and traffic keeps flowing.",realWorld:"Cloud providers publish SLAs of 99.9% to 99.999% uptime. Each 9 represents about 8 hours vs 5 minutes of annual downtime. Achieving high nines requires redundancy at every layer."},
    {topic:"Network Security",q:"A web application firewall (WAF) is deployed in front of a company's online banking portal. What threats does it primarily protect against?",options:["Network-layer DDoS attacks","Application-layer attacks such as SQL injection and XSS","Physical server theft","Insider threats from employees"],answer:1,explanation:"A WAF inspects HTTP/HTTPS traffic at Layer 7 and filters application-layer attacks like SQL injection, XSS, CSRF, and command injection. Network DDoS requires upstream scrubbing. Physical and insider threats require different controls.",analogy:"A WAF is a doorman who reads every letter before it reaches the CEO — looking for forged signatures, hidden weapons (malicious code), and coded threats in the content.",realWorld:"PCI-DSS requires either a WAF or regular code reviews for internet-facing web applications handling cardholder data. ModSecurity (open source) and AWS WAF are common implementations."},
    {topic:"Architecture",q:"An organization needs to ensure that a compromised host on one subnet cannot communicate laterally with hosts on other internal subnets. Which control achieves this?",options:["Full-tunnel VPN","Microsegmentation","Air gap","Network address translation"],answer:1,explanation:"Microsegmentation divides the network into small, isolated segments with granular firewall policies controlling east-west (lateral) traffic between segments. Traditional perimeter firewalls only control north-south traffic.",analogy:"Microsegmentation is like giving every office in a building its own locked door — a burglar who breaks into one office can't automatically walk into the next.",realWorld:"Software-defined networking (SDN) and zero-trust platforms (VMware NSX, Illumio) enable microsegmentation. It significantly limits lateral movement during ransomware outbreaks."},
    {topic:"Cloud",q:"Which cloud deployment model is exclusively operated for a single organization but may be hosted on-premises or by a third party?",options:["Public cloud","Community cloud","Private cloud","Hybrid cloud"],answer:2,explanation:"A private cloud is dedicated to a single organization — either on-premises or hosted exclusively at a third-party facility. It offers the control and security of on-premises with potential cloud operational benefits.",analogy:"A private cloud is renting an entire hotel for your company's exclusive use versus sharing a hotel with other guests (public cloud).",realWorld:"Highly regulated industries (defense, healthcare) often use private clouds to meet compliance requirements while still gaining cloud operational efficiencies like virtualization and self-service provisioning."},
    {topic:"SD-WAN Security",q:"An organization replaces its MPLS-based WAN with SD-WAN so branch offices can break out internet traffic locally. Which security concern is MOST important to address in this new design?",options:["Each branch now has a direct internet connection that bypasses centralized security controls","SD-WAN increases latency for all branch traffic","MPLS tunnels are more vulnerable to eavesdropping than SD-WAN","SD-WAN cannot support QoS policies for VoIP traffic"],answer:0,explanation:"SD-WAN enables local internet breakout at branch sites, which eliminates the 'hairpin' back to the data center but also bypasses centralized firewalls, proxies, and DLP. The solution is deploying cloud-delivered security (SSE/SASE) or local security stacks at each branch so traffic is inspected at the edge regardless of path.",analogy:"Traditional WAN is routing every delivery truck back to the main warehouse for inspection before it goes anywhere. SD-WAN lets trucks deliver directly from the road — much faster, but now you need a security inspector at each local stop instead of one central checkpoint.",realWorld:"Organizations adopting SD-WAN pair it with SASE (Secure Access Service Edge) platforms like Zscaler or Palo Alto Prisma to maintain consistent security policy at every branch edge, replacing the centralized security stack that MPLS hairpinning provided."},
    {topic:"Infrastructure as Code (IaC) Security",q:"A DevOps team uses Terraform to provision cloud infrastructure. A security review finds hardcoded AWS secret keys in the Terraform configuration files stored in a public Git repository. What is the PRIMARY risk and correct remediation?",options:["Risk: performance degradation; Remediation: use smaller instance types","Risk: credential exposure enabling unauthorized cloud access; Remediation: use a secrets manager and remove credentials from code","Risk: misconfigured VPCs; Remediation: review CIDR block assignments","Risk: IaC drift; Remediation: run terraform plan before every deployment"],answer:1,explanation:"Hardcoded credentials in IaC files committed to version control — especially public repositories — expose cloud account access to anyone who views the repo. The correct remediation is to store secrets in a dedicated secrets manager (AWS Secrets Manager, HashiCorp Vault), reference them dynamically, and rotate any exposed credentials immediately. IaC security scanning tools (tfsec, Checkov) detect this class of issue in CI/CD pipelines.",analogy:"Hardcoding credentials in IaC is like writing your safe combination in permanent marker on the safe door, then photographing it and posting it on a public bulletin board. The safe (cloud account) becomes worthless the moment anyone reads the sign.",realWorld:"Thousands of AWS accounts are compromised each year via exposed credentials in public GitHub repos. Automated scanners (GitGuardian, truffleHog) monitor commits for secret patterns and alert within seconds of a push. Pre-commit hooks can block the commit before it ever reaches the remote."},
    {topic:"Secure DNS (DNSSEC / DoH / DoT)",q:"An organization wants to prevent attackers from intercepting and tampering with DNS responses sent to its clients. Which technology cryptographically signs DNS records so resolvers can verify their authenticity?",options:["DNS over HTTPS (DoH)","DNS over TLS (DoT)","DNSSEC","Split-horizon DNS"],answer:2,explanation:"DNSSEC (DNS Security Extensions) adds digital signatures to DNS records. Resolvers verify the signature chain from the root to the authoritative zone, detecting forged or tampered responses. DoH and DoT encrypt the DNS query in transit (privacy), but neither validates that the answer itself is authentic. Split-horizon DNS serves different answers to internal vs external clients.",analogy:"DNSSEC is a tamper-evident wax seal on every DNS response — if anyone alters the envelope after it leaves the post office, the broken seal alerts the recipient. DoH and DoT are privacy envelopes that hide the address from onlookers but don't prove the sender is legitimate.",realWorld:"Cache poisoning attacks (like the Kaminsky attack) can redirect users to malicious sites by injecting fake DNS responses. DNSSEC prevents this by requiring resolver validation against signed records. Many ccTLDs and .gov domains mandate DNSSEC signing on their zones."},
    {topic:"Deception Technology",q:"A security team deploys systems that appear to be legitimate production servers but have no actual business purpose. The goal is to detect attackers who have already breached the perimeter. These systems are BEST described as:",options:["Honeypots","Bastion hosts","Jump servers","Network taps"],answer:0,explanation:"Honeypots are decoy systems with no legitimate production use. Any interaction with them is inherently suspicious, generating high-fidelity alerts with very low false-positive rates. A honeynet is a network of honeypots. Neither bastion hosts nor jump servers are deception tools — they are legitimate access-control infrastructure. Network taps are passive monitoring devices.",analogy:"A honeypot is a fake wallet left on a park bench by an undercover officer. No legitimate passerby needs to touch it; anyone who picks it up has revealed their intent without even realizing they tripped an alarm.",realWorld:"Internal honeypots are particularly effective at detecting lateral movement — an attacker who has breached the perimeter and is scanning internal subnets will probe the honeypot, generating an alert the defender can act on before the attacker reaches real targets. Products like Attivo Networks and Canary tokens implement this at scale."},
    {topic:"Load Balancer Security Benefits",q:"Which security benefit does a load balancer provide in addition to distributing traffic across multiple servers?",options:["It encrypts all data at rest on backend servers","It eliminates the need for firewall rules on backend servers","It can absorb volumetric DDoS traffic and perform TLS termination, shielding backend server IPs from direct exposure","It replaces the need for an IDS on the network segment"],answer:2,explanation:"Load balancers absorb and distribute traffic volume (mitigating single-server exhaustion attacks), terminate TLS so backend servers are shielded from direct internet exposure, and hide backend infrastructure topology. They can also enforce connection rate limits and perform basic health checking to route away from compromised nodes. They do not replace firewalls or IDS, and backend servers still require their own hardening.",analogy:"A load balancer is a doorman at a busy nightclub. The crowd (traffic) interacts only with the doorman — they never see the interior layout. The doorman decides which entrance to send each person through and can turn away guests who arrive too fast (rate limiting).",realWorld:"AWS Application Load Balancers and NGINX act as TLS terminators, meaning external attackers see only the load balancer's IP, never the individual application server IPs. This is a meaningful defense-in-depth layer during targeted attacks and DDoS events."},
    {topic:"SDLC Secure Design — Threat Modeling",q:"During the design phase of the SDLC, the development team systematically identifies potential threats, attack vectors, and necessary countermeasures for a new payment application. This activity is called:",options:["Penetration testing","Threat modeling","Code review","Regression testing"],answer:1,explanation:"Threat modeling is performed in the design phase to identify potential threats before code is written. Common frameworks include STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) and PASTA. Pen testing occurs after deployment on a working system. Code review analyzes existing code. Regression testing validates that new changes don't break existing functionality.",analogy:"Threat modeling is the architectural review before a building breaks ground — identifying fire escape requirements, structural weak points, and access control needs on paper is far cheaper than retrofitting them after the building is occupied.",realWorld:"Microsoft's SDL (Security Development Lifecycle) mandates threat modeling at the design stage. A data-flow diagram of the payment app reveals where cardholder data crosses trust boundaries — each crossing is a potential attack surface requiring a countermeasure. Finding these in design costs $100; finding them post-breach costs millions."},
  ]},
  {id:4,name:"Security Operations",weight:"28%",color:C.d5,icon:"⚙️",desc:"Identity management, endpoint security, incident response, forensics",questions:[
    {topic:"Identity Management",q:"A user leaves a company. Which IAM process ensures their access to all systems is immediately removed?",options:["Provisioning","Deprovisioning","Federation","Recertification"],answer:1,explanation:"Deprovisioning removes access rights across all systems when an employee leaves or changes roles. Provisioning grants access. Federation extends identity across organizations. Recertification periodically reviews existing access.",analogy:"Provisioning is cutting a key for a new employee. Deprovisioning is changing all the locks when someone leaves.",realWorld:"Automated deprovisioning via HR system integration is critical. Manual processes leave orphaned accounts — a common audit finding and attack vector for ex-employees or credential theft."},
    {topic:"Identity Management",q:"Which authentication protocol allows users to log in once and access multiple applications, including third-party cloud services, using SAML assertions?",options:["RADIUS","Kerberos","SAML-based SSO","LDAP"],answer:2,explanation:"SAML (Security Assertion Markup Language) enables SSO across organizational boundaries. An Identity Provider (IdP) issues SAML assertions; Service Providers (SPs) trust them. This allows employees to use corporate credentials for SaaS apps.",analogy:"SAML SSO is a corporate ID badge that third-party buildings agree to honor. Swipe at the IdP's reader once; every trusted building (SP) lets you in.",realWorld:"When a company uses Okta or Azure AD to let employees log into Salesforce, GitHub, and Slack with their corporate credentials, SAML is the protocol enabling it."},
    {topic:"Endpoint Security",q:"Which endpoint security technology monitors and records all endpoint activity, detects threats based on behavior, and allows security teams to investigate and respond remotely?",options:["Traditional antivirus","DLP agent","EDR (Endpoint Detection and Response)","HIDS"],answer:2,explanation:"EDR continuously monitors endpoints for suspicious behavior, records telemetry, and provides investigation and response capabilities. Traditional AV only detects known signatures. HIDS monitors for file changes. DLP prevents data exfiltration.",analogy:"Traditional AV is a wanted-poster check — only catches known criminals. EDR is a detective on every device watching behavior — catches the unknown criminal by what they do, not who they are.",realWorld:"CrowdStrike Falcon, Microsoft Defender for Endpoint, and Carbon Black are EDR platforms. They became critical during the rise of fileless malware that traditional AV misses."},
    {topic:"Incident Response",q:"During an active ransomware incident, the FIRST action the security team should take is:",options:["Pay the ransom to minimize downtime","Restore from backup","Isolate affected systems from the network","Run a full antivirus scan"],answer:2,explanation:"Containment (isolation) is the first priority in the Containment phase of incident response. Disconnecting infected systems from the network stops ransomware from encrypting network shares and spreading to other hosts.",analogy:"When your house is on fire, you close doors before calling the fire department — contain the spread first, then fight it.",realWorld:"Every second of delay during ransomware allows more encryption and lateral movement. IR playbooks should have automated isolation triggers or a single-click network quarantine capability."},
    {topic:"Forensics",q:"A digital forensics investigator needs to examine a compromised server. In what order should evidence be collected based on the order of volatility?",options:["Hard drive, then RAM, then network connections","RAM, then running processes, then hard drive","Logs first, then RAM, then hard drive","Network connections, then hard drive, then logs"],answer:1,explanation:"Order of volatility goes from most volatile to least: CPU registers, RAM, running processes, network connections, then non-volatile storage (hard drive), then logs and archives. RAM is lost on power-off and must be collected first.",analogy:"Collect the sandcastle before the tide comes in. RAM is the sandcastle — beautiful and temporary. The hard drive is the sand underneath — it'll still be there tomorrow.",realWorld:"Live forensics tools like Volatility capture memory images. Shutting down a system to make an image 'safe to move' destroys the most valuable volatile evidence."},
    {topic:"Identity Management",q:"An organization requires that no single person can both approve and execute a wire transfer. This enforces which security principle?",options:["Least privilege","Separation of duties","Job rotation","Need to know"],answer:1,explanation:"Separation of duties (SoD) requires that critical tasks be split between multiple people so no single person can commit fraud or error without a second person's involvement. This is a core financial and IT control.",analogy:"Separation of duties is two-person missile launch protocol — two keys, turned simultaneously, by two different officers. One person can't do it alone.",realWorld:"In IT, SoD means the developer can't also approve their own code deployments into production. In finance, the person who requests a payment can't also authorize it."},
    {topic:"Log Management",q:"Which tool aggregates log data from across an organization's infrastructure, correlates events in real time, and generates security alerts?",options:["IPS","EDR","SIEM","DLP"],answer:2,explanation:"SIEM (Security Information and Event Management) collects, normalizes, and correlates logs from firewalls, servers, endpoints, and cloud services. It identifies attack patterns across sources that individually look innocent.",analogy:"SIEM is an air traffic control tower that watches every plane at once. One plane landing is normal. Fifty planes all heading to the same runway at once is an emergency.",realWorld:"Splunk, Microsoft Sentinel, and IBM QRadar are SIEM platforms. Alert fatigue is the main challenge — SOAR automation handles routine alerts so analysts focus on high-fidelity incidents."},
    {topic:"Vulnerability Management",q:"After deploying a patch, a vulnerability management team wants to confirm the vulnerability is actually remediated. What is the appropriate action?",options:["Archive the CVE and close the ticket","Rerun the vulnerability scan and verify the finding is gone","Run a penetration test immediately","Update the risk register and accept the risk"],answer:1,explanation:"Vulnerability validation — rescanning after patching — confirms the remediation was successful. Closing a ticket without validation is a false close; the vulnerability may still exist due to a failed patch or missed system.",analogy:"After fixing a leaky pipe, you turn the water back on and watch for drips. You don't just assume the fix worked because a plumber was there.",realWorld:"Vulnerability management workflows should require a rescan and verified-clear status before closure. This prevents organizations from falsely believing they're secure."},
    {topic:"Identity Management",q:"An employee is granted temporary elevated permissions to perform a specific administrative task, and the permissions are automatically removed when the task is complete. This is called:",options:["Just-in-Time (JIT) access","Persistent privileged access","Role-based access control","Discretionary access control"],answer:0,explanation:"Just-in-Time (JIT) access grants elevated permissions only for the duration of a specific task and revokes them automatically afterward. This is a PAM (Privileged Access Management) best practice that reduces the standing attack surface.",analogy:"JIT access is a visitor badge that automatically expires at 5pm. It grants you what you need for the day and disappears — you can't use it tomorrow.",realWorld:"Azure PIM (Privileged Identity Management) and CyberArk implement JIT access. Standing admin accounts that exist 24/7 are the primary target in enterprise network breaches."},
    {topic:"Incident Response",q:"After resolving a security incident, the team documents what happened, what worked, what failed, and how to prevent recurrence. This phase of the incident response lifecycle is:",options:["Preparation","Containment","Eradication","Lessons Learned"],answer:3,explanation:"The Lessons Learned (or Post-Incident Activity) phase occurs after recovery. It documents the timeline, root cause, response effectiveness, and improvement actions. This feeds back into the Preparation phase for the next incident.",analogy:"A post-incident review is a football team's film review after the game — not to punish mistakes but to understand them so the next game goes better.",realWorld:"Lessons learned reports are required by many compliance frameworks. They drive improvements to detection, response playbooks, and preventive controls."},
    {topic:"Endpoint Privilege Management",q:"A company wants to prevent standard users from installing software or modifying system settings, while still allowing approved administrative tasks without giving users permanent admin rights. Which solution BEST addresses this?",options:["Deploying full-disk encryption on all endpoints","Implementing an Endpoint Privilege Management (EPM) solution that elevates specific approved applications on demand","Creating a separate admin account for every user","Disabling Windows Defender on all endpoints"],answer:1,explanation:"Endpoint Privilege Management (EPM) enforces least privilege by running users as standard accounts by default while allowing specific approved applications or tasks to run with elevated privileges without granting the user permanent admin rights. This limits malware's ability to persist or spread, since most malware requires elevated privileges to install or modify the system. Giving users a separate admin account grants permanent elevation — the opposite of least privilege.",analogy:"EPM is a vending machine for admin rights. You don't carry the keys to the stockroom — you press a button for a specific approved item, it dispenses, and the machine locks again. Full admin access is handing the employee the stockroom keys permanently.",realWorld:"CyberArk Endpoint Privilege Manager and BeyondTrust Privilege Management for Windows are EPM platforms. They are a primary defense against ransomware, since most ransomware requires admin-level access to disable AV or spread to network shares. Removing persistent admin rights breaks the kill chain."},
    {topic:"Data Loss Prevention (DLP)",q:"An organization needs to prevent employees from emailing files containing credit card numbers to personal email accounts. Which control is MOST directly designed to address this?",options:["Implementing full-disk encryption on all endpoints","Configuring firewall rules to block outbound SMTP traffic","Deploying a Data Loss Prevention (DLP) solution that inspects outbound traffic for sensitive data patterns","Enabling multi-factor authentication on email accounts"],answer:2,explanation:"DLP solutions inspect outbound traffic (email, web uploads, removable media) for sensitive data patterns such as credit card number formats (PAN data), SSNs, or custom patterns. When a match is found, DLP can block, quarantine, or alert on the transfer. Full-disk encryption protects data at rest, not in transit. Blocking all SMTP is too broad and breaks business operations. MFA protects account access, not data exfiltration.",analogy:"DLP is a customs scanner at the airport that automatically flags packages containing prohibited items. The passenger (employee) approaches the checkpoint, the scanner reads the contents, and the officer blocks the shipment if credit card numbers are detected — regardless of whether the passenger knew they were smuggling.",realWorld:"DLP is a key PCI-DSS and HIPAA control. Microsoft Purview and Symantec DLP can fingerprint specific documents and detect them even when renamed or slightly modified. Endpoint DLP also blocks copying sensitive data to USB drives or personal cloud storage applications like personal Dropbox."},
    {topic:"Log Sources for SOC Analysts",q:"A SOC analyst investigating a suspected account compromise wants to determine which user authenticated, from what IP address, at what time, and whether the authentication succeeded or failed. Which log source provides this information MOST directly?",options:["Network flow (NetFlow) records","Authentication and identity provider logs (e.g., Active Directory, Azure AD sign-in logs)","Application server performance metrics","DNS query logs"],answer:1,explanation:"Authentication logs from identity providers (Active Directory Security event logs, Azure AD sign-in logs, Okta logs) record username, source IP, timestamp, authentication method, and success/failure status — exactly what is needed for account compromise investigation. NetFlow shows connection metadata but not authentication details. Performance metrics show system health. DNS logs show name resolution but not who authenticated.",analogy:"Authentication logs are the security desk's visitor ledger — name, ID checked, time in, time out, whether they were turned away. NetFlow is just the parking lot camera showing which cars came and went without recording who was driving.",realWorld:"In a SIEM investigation, Azure AD sign-in logs are often the first pivot point — analysts look for impossible travel (authentication from New York at 9am, then Tokyo at 9:05am), unfamiliar ASNs, or a burst of failed authentications followed by a success (password spray success)."},
    {topic:"Threat Intelligence Platforms (TIP)",q:"A security team wants to automatically ingest threat feeds from multiple sources, correlate indicators of compromise (IoCs) with internal telemetry, and share threat data with peer organizations in a standardized format. Which capability set describes a Threat Intelligence Platform (TIP) using industry-standard protocols?",options:["SIEM log aggregation using syslog and SNMP","Threat feed ingestion, IoC correlation, and sharing via STIX/TAXII","Vulnerability scanning and CVE reporting via OpenVAS","Incident ticketing and workflow management via ServiceNow"],answer:1,explanation:"A Threat Intelligence Platform (TIP) aggregates threat feeds from multiple sources, normalizes and enriches IoCs, correlates them with internal telemetry, and facilitates sharing using STIX (Structured Threat Information eXpression) as the data format and TAXII (Trusted Automated eXchange of Intelligence Information) as the transport protocol. SIEM handles log aggregation. Vulnerability scanners handle CVE discovery. Ticketing systems handle workflow — none of these perform structured threat intelligence operations.",analogy:"A TIP is the intelligence fusion center for cyber threats. It collects reports from police departments nationwide (threat feeds), cross-references them with local crime data (internal telemetry), and transmits standardized bulletins (STIX/TAXII) to partner agencies — all automatically.",realWorld:"Platforms like Recorded Future, ThreatConnect, and MISP (open source) are TIPs. When a new ransomware campaign is identified, a TIP ingests the associated IP addresses and file hashes, automatically checks if any match traffic in the organization's SIEM, and pushes the IoCs to the firewall blocklist — often before any analyst touches the data."},
    {topic:"eDiscovery and Legal Holds",q:"A company receives notice of pending litigation. Legal counsel instructs IT to preserve all email communications from a specific employee for the past three years, overriding the organization's standard 90-day email deletion policy. This action is BEST described as:",options:["Data classification","A legal hold (litigation hold)","Backup rotation","Chain of custody"],answer:1,explanation:"A legal hold (litigation hold) is a directive from legal counsel to suspend normal data deletion schedules and preserve potentially relevant electronically stored information (ESI) in anticipation of litigation or investigation. It supersedes standard retention policies. Data classification assigns sensitivity levels. Backup rotation is a storage management process. Chain of custody documents who handled evidence — it's a related concept but not what describes the preservation directive itself.",analogy:"A legal hold is the judge ordering a library to stop shredding its visitor logs and preserve them exactly as they are. The library's normal 90-day shredding schedule stops the moment that court order arrives — anything destroyed after notice can constitute spoliation.",realWorld:"Failure to implement a legal hold that results in evidence destruction can lead to spoliation sanctions, adverse inference instructions (the jury assumes the deleted data was damaging), and significant penalties. eDiscovery tools like Microsoft Purview eDiscovery and Relativity automate hold placement and ESI collection at scale."},
    {topic:"Patch Management Prioritization",q:"A vulnerability scanner returns 500 findings across the enterprise. The security team can only patch 50 systems this sprint. Which approach to prioritization is MOST aligned with risk-based patch management?",options:["Patch in alphabetical order by system hostname","Patch only systems with CVSS scores of 10","Prioritize patches based on CVSS score combined with asset criticality, internet exposure, and known active exploitation","Patch all workstations before any servers, regardless of vulnerability severity"],answer:2,explanation:"Risk-based patch management combines vulnerability severity (CVSS) with environmental context: how critical is the asset, is it exposed to the internet or internal only, and is the vulnerability being actively exploited in the wild (CISA KEV catalog). A CVSS 7 on an internet-facing, business-critical server may outrank a CVSS 9 on an isolated internal test system. Alphabetical ordering and blanket rules ignore business context entirely.",analogy:"Patching by CVSS alone is triaging patients by height instead of injury severity. Risk-based patching is the ER triage nurse who considers the wound severity AND whether the patient is in cardiac arrest AND whether they're a surgeon needed in the OR — context determines the queue.",realWorld:"CISA's Known Exploited Vulnerabilities (KEV) catalog is a mandatory patching list for federal agencies and a risk signal for everyone else. A CVSS 6 vulnerability on the KEV list is being actively weaponized — it ranks higher than a CVSS 9 theoretical flaw with no known exploit code."},
  ]},
  {id:5,name:"Security Program Management & Oversight",weight:"20%",color:C.gold,icon:"📋",desc:"Risk management, compliance, data privacy, auditing",questions:[
    {topic:"Risk Management",q:"A company decides to purchase cyber liability insurance to handle the financial impact of a potential data breach. Which risk treatment option does this represent?",options:["Risk acceptance","Risk avoidance","Risk transfer","Risk mitigation"],answer:2,explanation:"Risk transfer shifts the financial impact of a risk to a third party (insurance company, contract clause). The risk itself still exists, but the financial consequences are borne by the insurer.",analogy:"Buying car insurance doesn't make you a safer driver (that would be mitigation). It transfers the financial consequences of an accident to the insurer.",realWorld:"Cyber insurance is a risk transfer mechanism, not a security control. Insurers increasingly require MFA, EDR, and incident response plans before issuing policies — effectively enforcing security baselines."},
    {topic:"Risk Management",q:"A risk assessment determines that the cost to mitigate a vulnerability exceeds the potential loss from exploitation. The organization documents this and takes no action. This is:",options:["Risk transfer","Risk mitigation","Risk acceptance","Risk avoidance"],answer:2,explanation:"Risk acceptance acknowledges a known risk and consciously decides not to take action, typically when the mitigation cost exceeds the potential impact. It must be formally documented and signed off by management.",analogy:"Choosing not to buy flood insurance for a house in the desert is risk acceptance — the probability and potential loss don't justify the premium.",realWorld:"Risk acceptance should never be informal. Documented acceptance with management sign-off creates accountability and ensures the decision is revisited periodically."},
    {topic:"Compliance",q:"Which regulation requires organizations to notify affected individuals and regulators within 72 hours of discovering a personal data breach affecting EU residents?",options:["HIPAA","PCI-DSS","GDPR","SOX"],answer:2,explanation:"GDPR (General Data Protection Regulation) mandates 72-hour breach notification to supervisory authorities and 'without undue delay' notification to affected individuals when the breach poses high risk. HIPAA requires 60 days. PCI-DSS has its own notification requirements.",analogy:"GDPR's 72-hour rule is like a medical practice's legal obligation to report a disease outbreak to the health department within three days — protecting the public takes priority over internal deliberation.",realWorld:"Organizations processing EU residents' data must comply with GDPR regardless of where the organization is based. The 72-hour clock starts when the organization 'becomes aware' — not when the breach occurred."},
    {topic:"Compliance",q:"Which compliance framework is specifically designed to protect payment card data and applies to any organization that stores, processes, or transmits cardholder data?",options:["HIPAA","GDPR","NIST CSF","PCI-DSS"],answer:3,explanation:"PCI-DSS (Payment Card Industry Data Security Standard) applies to all entities handling cardholder data, regardless of size or industry. It specifies 12 high-level requirements covering network security, access control, encryption, and monitoring.",analogy:"PCI-DSS is the restaurant health code for handling payment cards. Any establishment that accepts credit cards must pass the inspection — no exemptions based on size.",realWorld:"A small online store processing Visa payments must be PCI-DSS compliant. Non-compliance can result in fines and loss of the ability to process card payments — the commercial equivalent of losing a business license."},
    {topic:"Data Governance",q:"A company classifies some data as 'Restricted' and other data as 'Public.' Which statement BEST describes the purpose of data classification?",options:["To determine which data should be encrypted with AES vs RSA","To prioritize security controls and access rights based on data sensitivity","To identify which data should be deleted after a retention period","To separate data by file format for storage efficiency"],answer:1,explanation:"Data classification assigns sensitivity levels so that appropriate security controls, access rights, and handling procedures can be applied proportional to the data's value and regulatory requirements. Higher classification = stronger controls.",analogy:"Data classification is like mail sorting: postcards, first-class letters, and certified letters all get different handling, routing, and security based on their importance.",realWorld:"A healthcare organization classifies PHI as Restricted, employee names as Confidential, and press releases as Public. Each classification triggers different encryption, access, retention, and disposal procedures."},
    {topic:"Business Continuity",q:"An organization has an RTO of 4 hours and an RPO of 1 hour for their ERP system. What do these values mean?",options:["The system can be down 4 hours; up to 1 hour of data can be lost","The system must be backed up every 4 hours; it can be down for 1 hour","Data must be replicated every 4 hours; recovery takes 1 hour","Both refer to the maximum time the system can be unavailable"],answer:0,explanation:"RTO (Recovery Time Objective) is the maximum acceptable downtime — 4 hours to restore service. RPO (Recovery Point Objective) is the maximum acceptable data loss measured in time — backups must be frequent enough that no more than 1 hour of data is lost.",analogy:"RTO is your delivery deadline — the business needs the system back in 4 hours. RPO is your data freshness requirement — you can't lose more than 1 hour of transactions.",realWorld:"A 1-hour RPO requires at least hourly backups. A 4-hour RTO requires a documented, tested recovery process. Mismatched RPO/RTO planning is a common finding in DR audits."},
    {topic:"Third-Party Risk",q:"Before engaging a cloud storage vendor who will process customer personal data, which document should the organization require to establish data protection obligations?",options:["NDA (Non-Disclosure Agreement)","SLA (Service Level Agreement)","DPA (Data Processing Agreement)","MSA (Master Service Agreement)"],answer:2,explanation:"A DPA (Data Processing Agreement) contractually establishes how a vendor will handle personal data, required under GDPR and other privacy regulations. An NDA covers confidentiality. An SLA covers uptime/performance. An MSA covers general commercial terms.",analogy:"A DPA is a food safety contract with your catering company — it specifies how they'll handle the food (data), allergen protocols (data categories), and what to do if something goes wrong (breach response).",realWorld:"GDPR Article 28 mandates DPAs between data controllers and data processors. Signing up a vendor without a DPA when they'll handle EU personal data is a direct regulatory violation."},
    {topic:"Governance",q:"Which document establishes the organization's overall approach, goals, and management commitment to information security, typically signed by senior leadership?",options:["Security procedure","Security standard","Security baseline","Information security policy"],answer:3,explanation:"An information security policy is the top-level governance document that states management's commitment and strategic direction for security. Standards define specific requirements. Procedures are step-by-step instructions. Baselines define minimum security configurations.",analogy:"The security policy is the company's constitution — broad principles signed by the CEO. Standards are laws. Procedures are instruction manuals. All three derive authority from the policy.",realWorld:"Auditors always ask for the information security policy first — it establishes that leadership owns security. A policy signed by the CISO but not the CEO signals weak security governance."},
    {topic:"Risk Management",q:"A security team identifies a new vulnerability but determines it has never been actively exploited in the wild and the affected system is non-critical. After documenting the risk, management formally accepts it. This accepted risk is referred to as:",options:["Inherent risk","Residual risk","Secondary risk","Control risk"],answer:1,explanation:"Residual risk is the risk that remains after controls are applied. When management accepts residual risk after reviewing it, they formally acknowledge the remaining exposure is within the organization's risk tolerance.",analogy:"Residual risk is the risk left after you've done everything reasonable. You've installed smoke detectors, sprinklers, and fire extinguishers — the residual risk is the fire that still theoretically happens despite all those controls.",realWorld:"Risk registers track both inherent risk (before controls) and residual risk (after controls). The gap between the two demonstrates the value of the security program."},
    {topic:"Compliance",q:"An organization undergoes a SOC 2 Type II audit. What does this audit specifically evaluate?",options:["Whether the organization is GDPR compliant for EU data","Whether security controls are effectively operating over a period of time (typically 6-12 months)","Whether the organization's payment card environment meets PCI-DSS requirements","Whether penetration testing was conducted this year"],answer:1,explanation:"SOC 2 Type II evaluates the effectiveness of an organization's controls over a defined period (typically 6-12 months), focusing on the Trust Service Criteria: Security, Availability, Confidentiality, Processing Integrity, and Privacy. Type I is a point-in-time assessment.",analogy:"SOC 2 Type I is a photo of your security controls at one moment. Type II is a year of security camera footage — did those controls actually work consistently over time?",realWorld:"SaaS vendors increasingly need SOC 2 Type II reports to win enterprise customers. Enterprises require evidence that their cloud vendors maintained security controls throughout the year, not just on audit day."},
    {topic:"Quantitative vs Qualitative Risk Analysis",q:"A risk analyst calculates the Annual Loss Expectancy (ALE) for a data breach by multiplying the Single Loss Expectancy (SLE) by the Annual Rate of Occurrence (ARO). This is an example of which type of risk analysis?",options:["Qualitative risk analysis","Quantitative risk analysis","Residual risk analysis","Inherent risk analysis"],answer:1,explanation:"Quantitative risk analysis assigns numeric (monetary) values to risk components. ALE = SLE × ARO, where SLE is the financial impact of a single event and ARO is how many times it's expected to occur per year. Qualitative risk analysis uses descriptive ratings (High/Medium/Low) without dollar amounts. Residual and inherent risk describe the state of risk before and after controls, not the analysis methodology.",analogy:"Quantitative analysis is an actuary calculating your car insurance premium to the dollar based on your driving record, age, and accident statistics. Qualitative analysis is your friend saying 'you're a pretty risky driver' — useful but not bankable.",realWorld:"ALE calculations drive security ROI conversations. If a control costs $50,000/year and the ALE it prevents is $200,000, it's a clear business case. Qualitative analysis is faster for initial triage; quantitative is used when justifying budget to the CFO or board."},
    {topic:"Business Impact Analysis (BIA)",q:"During a Business Impact Analysis (BIA), the organization identifies that if its order management system is unavailable for more than 6 hours, it will lose $500,000 in revenue and face regulatory penalties. What does this BIA output primarily inform?",options:["The organization's vulnerability scan schedule","The RTO and recovery prioritization for the order management system","The encryption standards required for order data at rest","The vendor selection criteria for the order management system"],answer:1,explanation:"The BIA quantifies the impact of system unavailability over time, which directly drives the Recovery Time Objective (RTO) — how quickly the system must be restored. The $500,000 threshold at 6 hours tells the DR team the system must recover in under 6 hours, which then drives architecture decisions (hot standby vs warm standby vs cold standby). Vulnerability scanning, encryption standards, and vendor selection are not driven by BIA impact quantification.",analogy:"A BIA is a financial medical exam for each business process. It tells you which organs (systems) are critical, how long the body can survive without each one, and what it costs per hour of failure — directly determining where to invest in the most advanced life support (DR capabilities).",realWorld:"BIA interviews with business unit owners identify MTD (Maximum Tolerable Downtime) for each process. The IT DR team uses MTD to set RTO targets: if the business says 4 hours MTD, the IT RTO must be under 4 hours with margin. This is why BIA precedes DR planning, not the reverse."},
    {topic:"Privacy by Design",q:"A development team designing a new mobile health application collects only the minimum personal data necessary for the app to function, embeds privacy controls into the system architecture from the start, and makes privacy protections the default setting — requiring user action to opt IN to additional data sharing. These practices collectively reflect which privacy principle?",options:["Data minimization only","Privacy by Design","Pseudonymization","Data sovereignty"],answer:1,explanation:"Privacy by Design (PbD) is a framework that embeds privacy protections proactively into systems from inception rather than as an afterthought. Its seven foundational principles include: proactive not reactive, privacy as the default, privacy embedded into design, full functionality, end-to-end security, visibility/transparency, and respect for user privacy. The scenario demonstrates multiple PbD principles simultaneously. Data minimization is one principle within PbD. Pseudonymization is a data protection technique. Data sovereignty refers to geographic data residency rules.",analogy:"Privacy by Design is building a house with the fire suppression system wired in from the foundation, not bolting a fire extinguisher to the wall after the house is built and occupied. Privacy is a structural requirement, not an optional accessory.",realWorld:"GDPR Article 25 mandates Privacy by Design and by Default as legal requirements for EU data processing. When regulators audit a data breach, one of the first questions is whether privacy was designed in from the start or added as an afterthought. PbD implementations have led to reduced fines in enforcement actions."},
    {topic:"Security Metrics and KPIs (MTTD / MTTR)",q:"A CISO wants to measure how quickly the security team detects incidents after they begin and how quickly they are fully resolved. Which metrics directly answer these two questions?",options:["MTTD (Mean Time to Detect) and MTTR (Mean Time to Respond/Resolve)","RTO (Recovery Time Objective) and RPO (Recovery Point Objective)","CVE count and CVSS average score","Number of phishing emails blocked and number of firewall rules"],answer:0,explanation:"MTTD measures the average time from the start of an incident until it is detected by the security team. MTTR measures the average time from detection (or incident start) until it is fully resolved. Together they quantify detection and response effectiveness. RTO/RPO are recovery planning targets, not measurement metrics. CVE counts and CVSS averages measure vulnerability exposure. Blocked phishing and firewall rules are activity metrics, not outcome metrics.",analogy:"MTTD is how long before a building's smoke detector notices the fire. MTTR is how long it takes from alarm to the last ember being extinguished. A fast alarm with a slow fire department is still a destroyed building — you need both metrics to measure real security effectiveness.",realWorld:"Industry benchmarks (IBM Cost of a Data Breach Report) show that organizations with MTTD under 100 days save an average of $1 million compared to those above 200 days. Security operations teams track MTTD and MTTR as primary KPIs and use SOAR automation to drive both numbers down."},
    {topic:"Tabletop Exercise vs Simulation vs Parallel Test",q:"An organization's incident response team gathers in a conference room and verbally walks through their response to a simulated ransomware scenario, discussing decisions and identifying gaps — but no systems are actually activated or tested. This is BEST described as:",options:["A parallel test","A full interruption test","A tabletop exercise","A simulation exercise"],answer:2,explanation:"A tabletop exercise is a discussion-based activity where team members talk through their response to a scenario without activating actual systems or procedures. A simulation (functional exercise) activates some response procedures with actual tools but in a controlled way. A parallel test activates the DR system alongside the production system simultaneously to validate recovery capability without taking production offline. A full interruption test actually takes production systems offline to test DR — the highest risk and most realistic test.",analogy:"A tabletop exercise is the chess players studying a famous game by talking through each move. A simulation is playing an actual game with clocks. A parallel test is running two tournaments simultaneously. A full interruption test is canceling the main tournament and running only the backup — realistic, but highest stakes.",realWorld:"Tabletop exercises are low-cost, high-frequency tests that surface procedural gaps, communication breakdowns, and role confusion without any operational risk. NIST SP 800-84 defines testing strategies from least to most disruptive. Most organizations run tabletops quarterly and full simulations annually, with parallel tests reserved for critical DR validation before a major system migration."},
    {topic:"Data Retention and Legal Hold Policies",q:"An organization's data retention policy mandates that customer transaction records be deleted after 3 years. Legal counsel places a litigation hold on all records for a specific customer dispute. Which principle governs this conflict?",options:["The retention policy takes precedence; records should be deleted on schedule","The litigation hold supersedes the retention policy; the specific records must be preserved until the hold is released","Both policies must be applied simultaneously, so the records are both held and deleted","The IT department decides which policy to follow based on storage capacity"],answer:1,explanation:"A litigation hold (legal hold) is a legal obligation that supersedes normal data retention and destruction schedules. Destroying records subject to a litigation hold constitutes spoliation of evidence, which can result in court sanctions, adverse inference rulings, and significant legal liability. The retention policy applies only to records not subject to a hold. The hold remains in force until released by legal counsel, regardless of how long that takes.",analogy:"A retention policy is the library's book disposal schedule. A litigation hold is a court order telling the library to lock a specific shelf in a vault. You cannot shred books from the locked shelf just because the disposal schedule says their time is up — the court order wins.",realWorld:"eDiscovery platforms like Microsoft Purview allow legal teams to place in-place holds on specific custodian mailboxes and SharePoint sites without IT involvement, creating an immutable audit trail. The records remain in place and can be searched by legal, but users are unaware of the hold — preventing evidence tampering."},
  ]},
];

const S={
  app:{minHeight:"100vh",background:C.bg,fontFamily:"'Poppins',system-ui,sans-serif",color:C.text,overflowX:"hidden"},
  scan:{display:"none"},
  wrap:{maxWidth:740,margin:"0 auto",padding:"24px 20px",position:"relative",zIndex:2},
  divider:{height:2,background:"linear-gradient(90deg,transparent,#e63946,transparent)",margin:"24px 0",borderRadius:2},
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
  const items=Array.from({length:28},(_,i)=>({left:`${(i*37+7)%100}%`,delay:`${((i*0.13)%0.9).toFixed(2)}s`,dur:`${(1.1+(i%5)*0.18).toFixed(2)}s`,color:[C.green,C.gold,C.d1,C.d3,C.purple,C.d2,C.d5][i%7],size:5+(i%5)}));
  return(<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:50,overflow:"hidden"}}><style>{`@keyframes floatUp{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(-110vh) rotate(720deg);opacity:0}}`}</style>{items.map((p,i)=>(<div key={i} style={{position:"absolute",top:"-10px",left:p.left,width:p.size,height:p.size,borderRadius:"50%",background:p.color,animation:`floatUp ${p.dur} ${p.delay} ease-in forwards`}}/>))}</div>);
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
        <div style={{fontSize:10,color:C.dim,letterSpacing:5,marginBottom:8}}>COMPTIA SY0-701</div>
        <div style={{fontSize:26,fontWeight:"bold",letterSpacing:4,color:C.d4,textShadow:`0 0 24px rgba(${hexRgb(C.d4)},0.5)`,marginBottom:4}}>COMPTIA TRAINER</div>
        <div style={{fontSize:10,color:C.dim,letterSpacing:3}}>5 DOMAINS &bull; EXAM-ALIGNED</div>
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
      <MenuCard icon="📚" title="Domain Study" sub="5 domains · SY0-701 aligned" color={C.d4} onClick={()=>setScreen("domainSelect")}/>
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
        <span style={{color:C.d4}}>HOW TO USE: </span>Work through each Domain in order. Use Flashcards anytime for quick review of cryptography, threats, and frameworks. After all 5 domains, the Full Practice Test unlocks. Target 80%+ before exam day.
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
        <div style={{fontSize:22}}>🔒</div>
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
        {!flipped?<div style={{fontSize:18,fontWeight:"bold",color:C.text,lineHeight:1.5}}>{card.term}</div>:<div style={{fontSize:13,color:C.text,lineHeight:1.8}}>{card.definition}</div>}
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
  function grade(result){const ng=[...grades,result];setGrades(ng);if(idx+1>=deck.length){setDone(true);}else{setIdx(i=>i+1);setRevealed(false);}}
  const gradeRef=useRef();
  gradeRef.current=grade;
  useEffect(()=>{
    function onKey(e){
      if(e.target.tagName==="INPUT")return;
      if(!revealed){if(e.key===" "||e.key==="Enter"){e.preventDefault();setRevealed(true);}}
      else{if(e.key==="ArrowRight"||e.key==="g"||e.key==="G")gradeRef.current("got");if(e.key==="ArrowLeft"||e.key==="m"||e.key==="M")gradeRef.current("missed");}
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
            {card.acronym&&<div style={{borderTop:`1px solid ${C.border}`,paddingTop:10}}><div style={{fontSize:10,color:C.gold,letterSpacing:2,marginBottom:4}}>MEMORY TRICK</div><div style={{fontSize:12,color:C.gold,lineHeight:1.7}}>{card.acronym}</div></div>}
            {card.analogy&&<div style={{borderTop:`1px solid ${C.border}`,paddingTop:10,marginTop:card.acronym?10:0}}><div style={{fontSize:10,color:C.dim,letterSpacing:2,marginBottom:4}}>ANALOGY</div><div style={{fontSize:12,color:C.dim,lineHeight:1.7}}>{card.analogy}</div></div>}
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
        {FLASHCARD_DOMAINS.map(fd=>(<button key={fd.id} onClick={()=>setFilter(fd.id)} style={{...S.btn(filter===fd.id?fd.color:C.muted,filter===fd.id),padding:"5px 10px",fontSize:10}}>{fd.icon}</button>))}
      </div>
      <div style={S.label()}>{filtered.length} cards</div>
      {filtered.map((card,i)=>{
        const open=expanded===i;
        return(
          <div key={i} style={{border:`1px solid ${open?card.deckColor:C.border}`,borderRadius:10,marginBottom:8,background:C.surface,overflow:"hidden"}}>
            <div onClick={()=>setExpanded(open?null:i)} style={{padding:"14px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:12,fontWeight:"bold",color:card.deckColor,marginBottom:3}}>{card.term}</div><div style={{fontSize:10,color:C.dim}}>{card.deckName} · {card.category}</div></div>
              <div style={{color:open?card.deckColor:C.muted,fontSize:16,transition:"transform 0.2s",transform:open?"rotate(90deg)":"none"}}>›</div>
            </div>
            {open&&<div style={{padding:"0 16px 16px",borderTop:`1px solid ${C.border}`}}>
              <div style={{fontSize:12,color:C.text,lineHeight:1.8,marginTop:12}}>{card.definition}</div>
              {card.acronym&&<div style={{padding:"10px 12px",background:`rgba(${hexRgb(C.gold)},0.06)`,border:`1px solid ${C.gold}`,borderRadius:8,marginTop:10}}><div style={{fontSize:10,color:C.gold,letterSpacing:2,marginBottom:4}}>MEMORY TRICK</div><div style={{fontSize:12,color:C.gold,lineHeight:1.7}}>{card.acronym}</div></div>}
              {card.analogy&&<div style={{padding:"10px 12px",background:`rgba(${hexRgb(card.deckColor)},0.05)`,border:`1px solid ${card.deckColor}`,borderRadius:8,marginTop:8}}><div style={{fontSize:10,color:card.deckColor,letterSpacing:2,marginBottom:4}}>ANALOGY</div><div style={{fontSize:12,color:C.dim,lineHeight:1.7}}>{card.analogy}</div></div>}
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
      <BackBtn onClick={()=>setScreen("home")} color={C.d4}/>
      <div style={S.label(C.d4)}>Select a Domain</div>
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
    [{d:1,n:15},{d:2,n:22},{d:3,n:18},{d:4,n:20},{d:5,n:15}].forEach(({d,n})=>{
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
          <div style={{fontSize:11,color:C.dim,letterSpacing:2,marginBottom:24}}>SY0-701 SIMULATION</div>
          <div style={{display:"flex",justifyContent:"center",gap:28,marginBottom:28,flexWrap:"wrap"}}>
            {[["90","QUESTIONS"],["5","DOMAINS"],["~80%","PASSING"],["TIMED","SESSION"]].map(([v,l])=>(
              <div key={l} style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:"bold",color:C.d4}}>{v}</div><div style={{fontSize:9,color:C.dim,letterSpacing:1}}>{l}</div></div>
            ))}
          </div>
          <div style={{...S.card(),textAlign:"left",marginBottom:20}}>
            <div style={S.label(C.gold)}>After the test you get</div>
            <div style={{fontSize:12,color:C.dim,lineHeight:2}}>✓ Total score with pass/fail verdict<br/>✓ Domain-by-domain breakdown<br/>✓ Weak spot analysis with study tips<br/>✓ Confidence calibration report<br/>✓ Full answer review with analogies</div>
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
  const handleNextRef=useRef();
  const q=questions[qIdx];
  const color=q.domainColor||C.d4;
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
      else{const i=map[e.key.toLowerCase()];if(i!==undefined&&i<q.options.length)setSelected(i);if(e.key==="1")setConf("sure");if(e.key==="2")setConf("guess");if(e.key==="Enter"&&selected!==null&&conf!==null)setConfirmed(true);}
    }
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[confirmed,selected,conf,q.options.length]);
  return(
    <div style={S.app}><div style={S.scan}/>
    <div style={S.wrap}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <button onClick={()=>setScreen("home")} style={{...S.btn(C.dim),padding:"4px 12px",fontSize:10}}>✕ EXIT</button>
        <div style={{fontSize:10,color:C.dim,letterSpacing:2}}>{mode==="domain"?qDomainName.toUpperCase():mode==="practice"?"PRACTICE TEST":"DAILY PRACTICE"}</div>
        <div style={{fontSize:11,color}}>{qIdx+1}/{total}</div>
      </div>
      <div style={{height:8,background:C.border,borderRadius:4,marginBottom:20,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${Math.round((qIdx/total)*100)}%`,background:color,transition:"width 0.3s",boxShadow:`0 0 8px ${color}`}}/>
      </div>
      <div style={{marginBottom:12}}>
        <span style={{...S.tag(color),marginRight:8}}>{qDomainName}</span>
        <span style={S.tag(C.muted)}>{q.topic}</span>
      </div>
      <div style={{fontSize:17,lineHeight:1.75,color:C.text,marginBottom:20,padding:"18px",background:C.surface,borderRadius:14,border:`1px solid ${C.border}`,fontWeight:500}}>{q.q}</div>
      {q.options.map((opt,i)=>(<button key={i} onClick={()=>{if(!confirmed)setSelected(i);}} style={S.optionBtn(getState(i),color)}><span style={{marginRight:10,opacity:0.5}}>{String.fromCharCode(65+i)}.</span>{opt}</button>))}
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
  const tips={"Security Controls":"Know all four categories (preventive/detective/corrective/compensating) and all four types (technical/managerial/operational/physical). Mix and match on exam questions.","Cryptography":"Symmetric = same key (AES). Asymmetric = key pair (RSA, ECC). Hashing = one-way (SHA-256). Know which algorithm is which type.","Authentication":"MFA requires two DIFFERENT factor types. Two passwords = not MFA. Know TOTP, FIDO2, push notifications, and smart cards.","PKI":"CA issues certs. CRL = revocation list. OCSP = real-time check. Certificate chain = root CA → intermediate CA → end cert.","Zero Trust":"Never trust, always verify. No implicit trust from network location. Verify every request. Microsegmentation + least privilege = zero trust in practice.","Malware":"Virus=host file required. Worm=self-propagates. Trojan=disguised. Ransomware=encrypts+extorts. Rootkit=hides itself. RAT=remote access. Fileless=lives in memory.","Social Engineering":"Phishing=email mass. Spear=targeted. Whaling=executive. Vishing=voice. Smishing=SMS. Baiting=physical media. Pretexting=fabricated scenario.","Application Attacks":"SQLi=parameterized queries fix it. XSS=output encoding+CSP fix it. CSRF=anti-CSRF tokens fix it. Buffer overflow=input validation+DEP/ASLR.","Network Attacks":"SYN flood=protocol layer. UDP flood=volumetric. DDoS=distributed. ARP spoofing=LAN MitM. DNS poisoning=redirects resolution.","Vulnerability Management":"CVSS=severity score. Context matters: exposure + data sensitivity + compensating controls affect actual risk priority.","Network Segmentation":"VLANs=logical separation. DMZ=screened subnet for public servers. Microsegmentation=granular east-west control. Air gap=physical isolation.","Cloud Security":"CASB=proxy between users and cloud. CSPM=cloud infrastructure config management. Shared responsibility=you own OS and above in IaaS.","VPN":"Split tunnel=only corporate traffic through VPN. Full tunnel=all traffic through VPN. Site-to-site=permanent network-to-network. IPsec+IKE=standard.","Defense in Depth":"No single control is perfect. Layer preventive+detective+corrective+compensating. Assume breach; design for resilience not just prevention.","Identity Management":"Provisioning=grant access. Deprovisioning=remove access. JIT=temporary elevated rights. PAM=privileged account vault+monitoring.","Incident Response":"Phases: Preparation→Identification→Containment→Eradication→Recovery→Lessons Learned. Containment FIRST when active incident.","Forensics":"Order of volatility: registers→RAM→processes→network→disk→logs. Chain of custody must be unbroken. Image the drive, work from the copy.","Log Management":"SIEM=aggregate+correlate+alert. SOAR=SIEM+automated response. Logs alone are useless without correlation.","Risk Management":"Accept=acknowledge. Avoid=eliminate. Transfer=insurance/contracts. Mitigate=controls. Residual risk=what remains after controls.","Compliance":"PCI-DSS=payment cards. HIPAA=US health data. GDPR=EU personal data (72hr notification). SOC 2=service orgs over time. ISO 27001=global ISMS.","Data Governance":"Classify first, then apply controls proportional to sensitivity. Public<Internal<Confidential<Restricted. Classification drives encryption, access, and disposal.","Business Continuity":"RTO=max downtime. RPO=max data loss. BCP=keep business running. DRP=restore IT systems. Test both with tabletop exercises.","Third-Party Risk":"DPA required for vendors processing personal data (GDPR Article 28). Right-to-audit clause in contracts. Supply chain attacks target software updates."};
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
            :<div style={{fontSize:12,color:C.dim,lineHeight:1.8}}>Not there yet — but this is why you practice. Target the weak spots above. One flashcard drill per weak area, then retake the domain quiz before attempting the practice test again.</div>
          }
        </div>
      )}
      <div style={S.row}>
        <button onClick={()=>setScreen("review")} style={{...S.btn(C.d4,true),flex:1}}>REVIEW ALL ANSWERS</button>
      </div>
      <div style={{...S.row,marginTop:8}}>
        <button onClick={()=>setScreen("home")} style={{...S.btn(C.dim),flex:1}}>HOME</button>
        {mode==="domain"&&<button onClick={()=>{setQuizState({...quizState,qIdx:0,answers:[],score:0,confidence:[]});setScreen("domainQuiz");}} style={{...S.btn(quizState.domain?.color||C.d4),flex:1}}>RETRY</button>}
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
  const color=q.domainColor||C.d4;
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
            {wrongIdxs.map(i=>(<button key={i} onClick={()=>setIdx(i)} style={{...S.btn(i===idx?C.red:C.muted,i===idx),padding:"3px 10px",fontSize:10}}>Q{i+1}</button>))}
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
