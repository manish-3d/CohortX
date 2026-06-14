function ensureUrl(url) {
  if (!url) {
    return "";
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `https://${url}`;
}

export default function SocialLinks({
  githubUsername,
  linkedinUrl,
  xUrl,
  leetcodeUrl,
}) {
  const links = [
    githubUsername && {
      label: "GitHub Heatmap",

      href: `https://github.com/${githubUsername}`,

      heatmap: `https://github.com/users/${githubUsername}/contributions`,

      icon: "devicon-github-original",
    },

    linkedinUrl && {
      label: "LinkedIn",

      href: ensureUrl(linkedinUrl),

      icon: "devicon-linkedin-plain",
    },

    xUrl && {
      label: "X",

      href: ensureUrl(xUrl),

      icon: "devicon-twitter-original",
    },

    leetcodeUrl && {
      label: "LeetCode",

      href: ensureUrl(leetcodeUrl),

      icon: "devicon-devicon-plain",
    },
  ].filter(Boolean);

  if (!links.length) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      {links.map((link) => (
        <a
          key={link.label}
          href={link.heatmap || link.href}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,

            padding: "12px 18px",

            background: "rgba(255,255,255,.65)",

            color: "#111",

            borderRadius: 999,

            border: "1px solid rgba(255,255,255,.9)",

            backdropFilter: "blur(18px)",

            textDecoration: "none",

            fontWeight: 700,

            boxShadow: "0 10px 40px rgba(29,155,240,.08)",

            transition: ".22s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";

            e.currentTarget.style.boxShadow =
              "0 18px 50px rgba(29,155,240,.18)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";

            e.currentTarget.style.boxShadow =
              "0 10px 40px rgba(29,155,240,.08)";
          }}
        >
          <i
            className={link.icon}
            style={{
              fontSize: 20,
            }}
          />

          {link.label}
        </a>
      ))}
    </div>
  );
}
