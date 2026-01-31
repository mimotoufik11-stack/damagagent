# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Please report (suspected) security vulnerabilities to **security@quranvideoeditor.com**.

You will receive a response from us within 48 hours. If the issue is confirmed, we will release a patch as soon as possible depending on complexity but historically within a few days.

## Security Best Practices

When using Quran Video Editor:

1. **Keep the application updated** to the latest version
2. **Download only from official sources** (GitHub releases, official website)
3. **Verify file integrity** using provided checksums
4. **Be cautious with project files** from untrusted sources
5. **Review permissions** requested by the application

## Known Security Considerations

### Electron Security

- **Context Isolation:** Enabled by default
- **Node Integration:** Disabled in renderer
- **Preload Scripts:** Carefully controlled API exposure
- **WebSecurity:** Enabled
- **Sandbox:** Enabled for renderer processes

### FFmpeg Integration

- Input validation for all FFmpeg commands
- Path sanitization to prevent command injection
- Limited access to file system through Electron APIs

### File Handling

- Type validation for uploaded files
- Size limits to prevent resource exhaustion
- Sandboxed file operations

## Security Updates

Security updates will be announced through:
- GitHub Security Advisories
- Release notes
- Official website

## Disclosure Policy

- **Report received:** Within 48 hours we acknowledge receipt
- **Investigation:** We investigate and verify the vulnerability
- **Fix development:** We work on a fix in a private repository
- **Public disclosure:** After fix is released, we disclose details

## Contact

For any security concerns, contact:
- Email: security@quranvideoeditor.com
- PGP Key: [Available on request]

Thank you for helping keep Quran Video Editor and its users safe!
