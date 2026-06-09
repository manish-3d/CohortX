function ensureUrl(url) {
  if (!url) {
    return "";
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `https://${url}`;
}

function getHost(url) {
  try {
    return new URL(ensureUrl(url)).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function SocialLinks({ githubUsername, linkedinUrl, xUrl }) {
  const links = [
    githubUsername && {
      label: "GitHub",
      value: `@${githubUsername}`,
      href: `https://github.com/${githubUsername}`,
    },
    linkedinUrl && {
      label: "LinkedIn",
      value: getHost(linkedinUrl),
      href: ensureUrl(linkedinUrl),
    },
    xUrl && {
      label: "X",
      value: getHost(xUrl),
      href: ensureUrl(xUrl),
    },
  ].filter(Boolean);

  if (!links.length) {
    return null;
  }

  return (
    <div className="social-links">
      {links.map((link) => (
        <a
          key={link.label}
          className="social-chip"
          href={link.href}
          target="_blank"
          rel="noreferrer"
        >
          <span className="social-label">{link.label}</span>

          <span className="social-value">{link.value}</span>
        </a>
      ))}
    </div>
  );
}
