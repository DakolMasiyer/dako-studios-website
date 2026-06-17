/* @ds-bundle: {"format":3,"namespace":"DakoStudiosDesignSystem_aadb54","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"NavBar","sourcePath":"components/core/NavBar.jsx"},{"name":"DakoStudios","sourcePath":"uploads/dako-studios-landing.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"7d019a2867ba","components/core/Button.jsx":"1b677474e74c","components/core/Card.jsx":"adf136e4f83f","components/core/Input.jsx":"487a22737386","components/core/NavBar.jsx":"9461b96871b1","uploads/dako-studios-landing.jsx":"3195a66e3bc4"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DakoStudiosDesignSystem_aadb54 = window.DakoStudiosDesignSystem_aadb54 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function Badge({
  children,
  variant = 'subtle',
  arm,
  dot = false,
  ...props
}) {
  const variants = {
    filled: {
      background: 'var(--color-accent-arm)',
      color: 'var(--color-carbon)',
      border: '1px solid transparent'
    },
    subtle: {
      background: 'var(--color-gold-subtle)',
      color: 'var(--color-accent-arm)',
      border: '1px solid transparent'
    },
    outline: {
      background: 'transparent',
      color: 'var(--color-accent-arm)',
      border: '1px solid var(--color-accent-arm)'
    },
    neutral: {
      background: 'var(--color-carbon-elevated)',
      color: 'var(--color-fg-muted)',
      border: '1px solid var(--color-border)'
    },
    dark: {
      background: 'var(--color-carbon)',
      color: 'var(--color-fg)',
      border: '1px solid var(--color-border)'
    }
  };
  const armOverride = arm ? {
    '--color-accent-arm': `var(--color-arm-${arm})`
  } : {};
  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '11px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    lineHeight: 1,
    padding: '4px 10px',
    borderRadius: '2px',
    whiteSpace: 'nowrap',
    ...variants[variant],
    ...armOverride
  };
  return React.createElement('span', {
    style,
    ...props
  }, dot && React.createElement('span', {
    style: {
      width: '5px',
      height: '5px',
      borderRadius: '50%',
      background: 'currentColor',
      flexShrink: 0
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function Button({
  children,
  variant = 'primary',
  size = 'md',
  arm,
  disabled = false,
  href,
  onClick,
  fullWidth = false,
  ...props
}) {
  const Tag = href ? 'a' : 'button';
  const sizes = {
    sm: {
      padding: '7px 16px',
      fontSize: '13px',
      height: '34px',
      borderRadius: '3px'
    },
    md: {
      padding: '11px 22px',
      fontSize: '14px',
      height: '42px',
      borderRadius: '4px'
    },
    lg: {
      padding: '15px 32px',
      fontSize: '16px',
      height: '52px',
      borderRadius: '4px'
    }
  };
  const variants = {
    primary: {
      background: 'var(--color-accent-arm)',
      color: 'var(--color-carbon)',
      border: '1px solid transparent'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--color-accent-arm)',
      border: '1px solid var(--color-accent-arm)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-fg-muted)',
      border: '1px solid transparent'
    },
    outline: {
      background: 'transparent',
      color: 'var(--color-fg)',
      border: '1px solid var(--color-border-strong)'
    },
    dark: {
      background: 'var(--color-carbon)',
      color: 'var(--color-warm-white)',
      border: '1px solid transparent'
    }
  };
  const armOverride = arm ? {
    '--color-accent-arm': `var(--color-arm-${arm})`
  } : {};
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    letterSpacing: '0.01em',
    lineHeight: 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'all 180ms ease',
    textDecoration: 'none',
    outline: 'none',
    width: fullWidth ? '100%' : 'auto',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    ...sizes[size],
    ...variants[variant || 'primary'],
    ...armOverride
  };
  const handleMouseEnter = e => {
    if (disabled) return;
    if (variant === 'primary') {
      e.currentTarget.style.filter = 'brightness(1.12)';
    } else if (variant === 'secondary' || variant === 'outline') {
      e.currentTarget.style.background = 'var(--color-border-subtle)';
    } else if (variant === 'ghost') {
      e.currentTarget.style.color = 'var(--color-fg)';
    }
    e.currentTarget.style.transform = 'translateY(-1px)';
  };
  const handleMouseLeave = e => {
    e.currentTarget.style.filter = '';
    e.currentTarget.style.transform = '';
    if (variant === 'secondary' || variant === 'outline' || variant === 'ghost') {
      e.currentTarget.style.background = 'transparent';
    }
    if (variant === 'ghost') {
      e.currentTarget.style.color = 'var(--color-fg-muted)';
    }
  };
  return React.createElement(Tag, {
    style: base,
    href,
    onClick: !disabled ? onClick : undefined,
    disabled: Tag === 'button' ? disabled : undefined,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    ...props
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function Card({
  children,
  variant = 'default',
  padding = 'md',
  arm,
  onClick,
  hoverable = false,
  ...props
}) {
  const paddings = {
    none: '0',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '40px'
  };
  const variants = {
    default: {
      background: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border)',
      boxShadow: 'none'
    },
    elevated: {
      background: 'var(--color-bg-elevated)',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-md)'
    },
    outlined: {
      background: 'transparent',
      border: '1px solid var(--color-border-strong)',
      boxShadow: 'none'
    },
    filled: {
      background: 'var(--color-bg-elevated)',
      border: '1px solid transparent',
      boxShadow: 'none'
    },
    accent: {
      background: 'var(--color-bg-surface)',
      border: '1px solid var(--color-accent-arm)',
      boxShadow: 'none'
    }
  };
  const armOverride = arm ? {
    '--color-accent-arm': `var(--color-arm-${arm})`
  } : {};
  const style = {
    borderRadius: 'var(--radius-lg)',
    padding: paddings[padding],
    transition: 'all 200ms ease',
    cursor: hoverable || onClick ? 'pointer' : 'default',
    ...variants[variant],
    ...armOverride
  };
  const handleMouseEnter = e => {
    if (!hoverable && !onClick) return;
    e.currentTarget.style.borderColor = 'var(--color-border-strong)';
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
  };
  const handleMouseLeave = e => {
    if (!hoverable && !onClick) return;
    e.currentTarget.style.borderColor = variants[variant].border.replace('1px solid ', '');
    e.currentTarget.style.transform = '';
    e.currentTarget.style.boxShadow = variants[variant].boxShadow || 'none';
  };
  return React.createElement('div', {
    style,
    onClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    ...props
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function Input({
  label,
  placeholder,
  helper,
  error,
  type = 'text',
  value,
  onChange,
  name,
  id,
  required = false,
  disabled = false,
  arm,
  ...props
}) {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');
  const armOverride = arm ? {
    '--color-accent-arm': `var(--color-arm-${arm})`
  } : {};
  const wrapStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
    ...armOverride
  };
  const labelStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    fontWeight: '600',
    color: error ? 'var(--color-error)' : 'var(--color-fg)',
    letterSpacing: '0.01em'
  };
  const inputStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    fontWeight: '400',
    color: 'var(--color-fg)',
    background: 'var(--color-bg-surface)',
    border: error ? '1px solid var(--color-error)' : '1px solid var(--color-border-strong)',
    borderRadius: '3px',
    padding: '11px 14px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 150ms ease',
    cursor: disabled ? 'not-allowed' : 'text',
    opacity: disabled ? 0.5 : 1
  };
  const helperStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: error ? 'var(--color-error)' : 'var(--color-fg-subtle)',
    lineHeight: 1.4
  };
  const handleFocus = e => {
    e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-accent-arm)';
    e.target.style.boxShadow = error ? '0 0 0 2px rgba(193,39,45,0.15)' : '0 0 0 2px var(--color-gold-subtle)';
  };
  const handleBlur = e => {
    e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border-strong)';
    e.target.style.boxShadow = 'none';
  };
  return React.createElement('div', {
    style: wrapStyle
  }, label && React.createElement('label', {
    htmlFor: inputId,
    style: labelStyle
  }, label, required && React.createElement('span', {
    style: {
      color: 'var(--color-accent-arm)',
      marginLeft: '3px'
    }
  }, '*')), React.createElement('input', {
    id: inputId,
    name,
    type,
    placeholder,
    value,
    onChange,
    disabled,
    required,
    style: inputStyle,
    onFocus: handleFocus,
    onBlur: handleBlur,
    ...props
  }), (helper || error) && React.createElement('span', {
    style: helperStyle
  }, error || helper));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/NavBar.jsx
try { (() => {
function NavBar({
  arm,
  links = [],
  cta,
  ctaHref,
  armLabel,
  onCtaClick,
  ...props
}) {
  const [open, setOpen] = React.useState(false);
  const armOverride = arm ? {
    '--color-accent-arm': `var(--color-arm-${arm})`
  } : {};
  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    background: 'rgba(22, 22, 24, 0.92)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--color-border)',
    ...armOverride
  };
  const innerStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 var(--section-px, 2rem)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px'
  };
  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    flexShrink: 0
  };
  const markStyle = {
    width: '28px',
    height: '28px',
    flexShrink: 0
  };
  const wordmarkStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px'
  };
  const dakoStyle = {
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    fontSize: '18px',
    letterSpacing: '-0.02em',
    color: 'var(--color-warm-white)',
    lineHeight: 1
  };
  const subStyle = {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '9px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: arm ? 'var(--color-accent-arm)' : 'var(--color-gray)',
    lineHeight: 1
  };
  const linkStyle = {
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: '14px',
    color: 'var(--color-gray)',
    textDecoration: 'none',
    padding: '4px 0',
    transition: 'color 150ms ease',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  };
  const accentPath = 'M 0 0 L 108 0 Q 205 0 205 100 Q 205 200 108 200 L 0 200 L 0 132 L 70 100 L 0 68 Z';
  const markColor = arm ? `var(--color-arm-${arm})` : 'var(--color-gold)';
  return React.createElement('nav', {
    style: navStyle,
    ...props
  }, React.createElement('div', {
    style: innerStyle
  },
  // Logo
  React.createElement('a', {
    href: '#',
    style: logoStyle
  }, React.createElement('svg', {
    viewBox: '0 0 205 200',
    style: markStyle,
    fill: 'none'
  }, React.createElement('path', {
    d: accentPath,
    fill: markColor
  })), React.createElement('div', {
    style: wordmarkStyle
  }, React.createElement('span', {
    style: dakoStyle
  }, 'DAKO'), React.createElement('span', {
    style: subStyle
  }, armLabel || 'STUDIOS'))),
  // Desktop links
  React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '32px'
    },
    className: 'dako-nav-links'
  }, ...links.map(link => React.createElement('a', {
    key: link.label,
    href: link.href || '#',
    style: linkStyle,
    onMouseEnter: e => {
      e.target.style.color = 'var(--color-warm-white)';
    },
    onMouseLeave: e => {
      e.target.style.color = 'var(--color-gray)';
    }
  }, link.label)), cta && React.createElement('button', {
    onClick: onCtaClick,
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: '600',
      fontSize: '13px',
      letterSpacing: '0.01em',
      background: 'var(--color-accent-arm)',
      color: 'var(--color-carbon)',
      border: 'none',
      borderRadius: '3px',
      padding: '9px 18px',
      cursor: 'pointer',
      transition: 'filter 150ms ease',
      whiteSpace: 'nowrap'
    },
    onMouseEnter: e => {
      e.currentTarget.style.filter = 'brightness(1.1)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.filter = '';
    }
  }, cta))));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/NavBar.jsx", error: String((e && e.message) || e) }); }

// uploads/dako-studios-landing.jsx
try { (() => {
const {
  useState,
  useEffect,
  useRef
} = React;
const SERVICES = [{
  id: "labs",
  badge: "LABS",
  title: "Web Design & Development",
  desc: "Premium websites for businesses that need to look as good as they perform. From single-page portfolios to full client portals — designed, built, and deployed in days, not months.",
  highlight: true,
  features: ["Custom design", "Mobile-first", "SEO-ready", "Client-editable CMS"]
}, {
  id: "brand",
  badge: "BRAND",
  title: "Branding & Digital Marketing",
  desc: "Visual identity systems, social media strategy, and digital campaigns that turn attention into revenue.",
  highlight: false,
  features: ["Logo & identity", "Social strategy", "Ad campaigns", "Content design"]
}, {
  id: "motion",
  badge: "MOTION",
  title: "Motion Design & Product Video",
  desc: "Short-form video ads that make physical products look premium. Perfect for product launches, social ads, and brand storytelling.",
  highlight: false,
  features: ["Product ads", "Social reels", "Brand films", "Launch videos"]
}, {
  id: "film",
  badge: "FILM",
  title: "Film Marketing & BTS",
  desc: "Poster design, behind-the-scenes content, and marketing assets for film productions and creative projects.",
  highlight: false,
  features: ["Film posters", "BTS content", "Press kits", "Premiere assets"]
}];
const PACKAGES = [{
  name: "Starter",
  price: "$1,500",
  currency: "USD",
  desc: "Perfect for professionals who need a credible web presence fast.",
  features: ["5-page responsive website", "Mobile-first design", "Contact form + WhatsApp CTA", "Basic SEO setup", "1 round of revisions", "5-day delivery"],
  cta: "Get Started",
  popular: false
}, {
  name: "Business",
  price: "$2,500",
  currency: "USD",
  desc: "For businesses ready to convert visitors into clients.",
  features: ["Up to 10 custom pages", "Client-editable CMS", "Booking/appointment integration", "SEO optimization + analytics", "Social media integration", "2 rounds of revisions", "7-day delivery"],
  cta: "Most Popular",
  popular: true
}, {
  name: "Premium",
  price: "$3,500",
  currency: "USD",
  desc: "Full digital presence — website plus a motion-design ad to drive traffic to it.",
  features: ["Everything in Business", "30-second product/brand video", "Custom animations & micro-interactions", "Performance optimization", "3 rounds of revisions", "10-day delivery", "30 days post-launch support"],
  cta: "Go Premium",
  popular: false
}];
const PORTFOLIO = [{
  name: "Property Showcase",
  niche: "Real Estate",
  color: "#1a3a2a",
  url: "#"
}, {
  name: "Legal Practice",
  niche: "Law Firm",
  color: "#1a1a2e",
  url: "#"
}, {
  name: "Wellness Clinic",
  niche: "Healthcare",
  color: "#2e1a1a",
  url: "#"
}, {
  name: "The Grand Table",
  niche: "Hospitality",
  color: "#2e2a1a",
  url: "#"
}, {
  name: "HomeBase Africa",
  niche: "Diaspora Services",
  color: "#1a2a2e",
  url: "#"
}];
function useInView(ref) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, {
      threshold: 0.15
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return isVisible;
}
function Section({
  children,
  className = "",
  id
}) {
  const ref = useRef(null);
  const visible = useInView(ref);
  return /*#__PURE__*/React.createElement("section", {
    ref: ref,
    id: id,
    className: `transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`
  }, children);
}
function DakoStudios() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState("labs");
  const currentYear = new Date().getFullYear();
  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
    setMenuOpen(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      background: "#FAFAF8",
      color: "#1a1a1a",
      minHeight: "100vh"
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: "rgba(250,250,248,0.92)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(0,0,0,0.06)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 64
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: "linear-gradient(135deg, #0D0D0D, #333)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: 1
    }
  }, "D"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: -0.5
    }
  }, "dako.studio")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 32
    },
    className: "hidden md:flex"
  }, ["Services", "Work", "Pricing", "Contact"].map(item => /*#__PURE__*/React.createElement("button", {
    key: item,
    onClick: () => scrollTo(item.toLowerCase()),
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: 14,
      fontWeight: 500,
      color: "#555",
      padding: 0
    }
  }, item)), /*#__PURE__*/React.createElement("button", {
    onClick: () => scrollTo("contact"),
    style: {
      background: "#0D0D0D",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      padding: "10px 20px",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer"
    }
  }, "Start a Project")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMenuOpen(!menuOpen),
    className: "md:hidden",
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: 24,
      padding: 4
    }
  }, menuOpen ? "✕" : "☰")), menuOpen && /*#__PURE__*/React.createElement("div", {
    className: "md:hidden",
    style: {
      padding: "16px 24px 24px",
      borderTop: "1px solid rgba(0,0,0,0.06)"
    }
  }, ["Services", "Work", "Pricing", "Contact"].map(item => /*#__PURE__*/React.createElement("button", {
    key: item,
    onClick: () => scrollTo(item.toLowerCase()),
    style: {
      display: "block",
      width: "100%",
      textAlign: "left",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: 16,
      fontWeight: 500,
      color: "#333",
      padding: "12px 0",
      borderBottom: "1px solid rgba(0,0,0,0.04)"
    }
  }, item)))), /*#__PURE__*/React.createElement(Section, {
    id: "hero",
    className: "pt-32 md:pt-40 pb-20 md:pb-32 px-6"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-block",
      background: "#E8F5E9",
      color: "#2E7D32",
      padding: "6px 14px",
      borderRadius: 100,
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 24,
      letterSpacing: 0.5
    }
  }, "Now accepting projects for Q3 ", currentYear), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "clamp(36px, 6vw, 72px)",
      fontWeight: 800,
      lineHeight: 1.08,
      letterSpacing: -2,
      maxWidth: 800,
      margin: "0 0 24px"
    }
  }, "Your business deserves a website that", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#2E7D32"
    }
  }, " actually works.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "clamp(16px, 2vw, 20px)",
      color: "#666",
      lineHeight: 1.6,
      maxWidth: 560,
      margin: "0 0 40px"
    }
  }, "We design and build premium websites for law firms, clinics, real estate agencies, and professional services \u2014 delivered in days, not months. Based in Abuja, serving clients worldwide."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => scrollTo("pricing"),
    style: {
      background: "#0D0D0D",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      padding: "16px 32px",
      fontSize: 16,
      fontWeight: 600,
      cursor: "pointer",
      transition: "transform 0.2s"
    },
    onMouseEnter: e => e.target.style.transform = "translateY(-2px)",
    onMouseLeave: e => e.target.style.transform = "translateY(0)"
  }, "See Pricing \u2192"), /*#__PURE__*/React.createElement("button", {
    onClick: () => scrollTo("work"),
    style: {
      background: "transparent",
      color: "#333",
      border: "2px solid #ddd",
      borderRadius: 10,
      padding: "14px 32px",
      fontSize: 16,
      fontWeight: 600,
      cursor: "pointer"
    }
  }, "View Work")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 32,
      marginTop: 56,
      paddingTop: 32,
      borderTop: "1px solid rgba(0,0,0,0.08)"
    }
  }, [{
    num: "5-7",
    label: "Day Delivery"
  }, {
    num: "100%",
    label: "Mobile-First"
  }, {
    num: "CMS",
    label: "Client-Editable"
  }].map(({
    num,
    label
  }) => /*#__PURE__*/React.createElement("div", {
    key: label
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 800,
      letterSpacing: -1
    }
  }, num), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "#888",
      fontWeight: 500,
      marginTop: 2
    }
  }, label)))))), /*#__PURE__*/React.createElement(Section, {
    id: "services",
    className: "py-20 md:py-28 px-6"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "#2E7D32",
      letterSpacing: 2,
      textTransform: "uppercase",
      marginBottom: 12
    }
  }, "Services"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "clamp(28px, 4vw, 44px)",
      fontWeight: 800,
      letterSpacing: -1.5,
      marginBottom: 48,
      maxWidth: 500
    }
  }, "Everything your brand needs to win online."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 16
    }
  }, SERVICES.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    onClick: () => setActiveService(s.id),
    style: {
      background: activeService === s.id ? "#0D0D0D" : "#fff",
      color: activeService === s.id ? "#fff" : "#1a1a1a",
      border: activeService === s.id ? "none" : "1px solid rgba(0,0,0,0.08)",
      borderRadius: 16,
      padding: 28,
      textAlign: "left",
      cursor: "pointer",
      transition: "all 0.3s",
      position: "relative",
      overflow: "hidden"
    }
  }, s.highlight && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 12,
      right: 12,
      background: activeService === s.id ? "#2E7D32" : "#E8F5E9",
      color: activeService === s.id ? "#fff" : "#2E7D32",
      padding: "4px 10px",
      borderRadius: 100,
      fontSize: 11,
      fontWeight: 700
    }
  }, "FEATURED"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 2,
      color: activeService === s.id ? "#888" : "#aaa",
      marginBottom: 12
    }
  }, s.badge), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      marginBottom: 10
    }
  }, s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: 1.6,
      color: activeService === s.id ? "#ccc" : "#777",
      marginBottom: 16
    }
  }, s.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6
    }
  }, s.features.map(f => /*#__PURE__*/React.createElement("span", {
    key: f,
    style: {
      padding: "4px 10px",
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 500,
      background: activeService === s.id ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.04)",
      color: activeService === s.id ? "#ddd" : "#666"
    }
  }, f)))))))), /*#__PURE__*/React.createElement(Section, {
    id: "work",
    className: "py-20 md:py-28 px-6",
    style: {
      background: "#0D0D0D"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "#2E7D32",
      letterSpacing: 2,
      textTransform: "uppercase",
      marginBottom: 12
    }
  }, "Portfolio"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "clamp(28px, 4vw, 44px)",
      fontWeight: 800,
      letterSpacing: -1.5,
      marginBottom: 16,
      color: "#fff"
    }
  }, "Recent work."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      color: "#888",
      marginBottom: 48,
      maxWidth: 480
    }
  }, "Premium web experiences built for businesses that take their online presence seriously."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: 16
    }
  }, PORTFOLIO.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    style: {
      background: p.color,
      borderRadius: 16,
      padding: 32,
      minHeight: 240,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      position: "relative",
      cursor: "pointer",
      transition: "transform 0.3s",
      border: "1px solid rgba(255,255,255,0.06)"
    },
    onMouseEnter: e => e.currentTarget.style.transform = "translateY(-4px)",
    onMouseLeave: e => e.currentTarget.style.transform = "translateY(0)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 16,
      right: 16,
      background: "rgba(255,255,255,0.1)",
      padding: "4px 12px",
      borderRadius: 100,
      fontSize: 12,
      color: "rgba(255,255,255,0.7)",
      fontWeight: 500
    }
  }, p.niche), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#fff",
      fontSize: 22,
      fontWeight: 700
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "rgba(255,255,255,0.5)",
      fontSize: 14,
      marginTop: 4
    }
  }, "View project \u2192")))))), /*#__PURE__*/React.createElement(Section, {
    id: "pricing",
    className: "py-20 md:py-28 px-6"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "#2E7D32",
      letterSpacing: 2,
      textTransform: "uppercase",
      marginBottom: 12
    }
  }, "Pricing"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "clamp(28px, 4vw, 44px)",
      fontWeight: 800,
      letterSpacing: -1.5,
      marginBottom: 12
    }
  }, "Transparent pricing. No surprises."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      color: "#666",
      marginBottom: 48,
      maxWidth: 520
    }
  }, "50% deposit to start. Balance on delivery. All packages include hosting setup, domain connection, and a handover walkthrough."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: 16
    }
  }, PACKAGES.map(pkg => /*#__PURE__*/React.createElement("div", {
    key: pkg.name,
    style: {
      background: pkg.popular ? "#0D0D0D" : "#fff",
      color: pkg.popular ? "#fff" : "#1a1a1a",
      border: pkg.popular ? "none" : "1px solid rgba(0,0,0,0.08)",
      borderRadius: 20,
      padding: 32,
      position: "relative"
    }
  }, pkg.popular && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: -12,
      left: 24,
      background: "#2E7D32",
      color: "#fff",
      padding: "6px 16px",
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 700
    }
  }, "MOST POPULAR"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      marginBottom: 4
    }
  }, pkg.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 44,
      fontWeight: 800,
      letterSpacing: -2,
      marginBottom: 4
    }
  }, pkg.price), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: pkg.popular ? "#aaa" : "#888",
      lineHeight: 1.5,
      marginBottom: 24
    }
  }, pkg.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      marginBottom: 28
    }
  }, pkg.features.map(f => /*#__PURE__*/React.createElement("div", {
    key: f,
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#2E7D32",
      fontWeight: 700,
      flexShrink: 0,
      marginTop: 1
    }
  }, "\u2713"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: pkg.popular ? "#ccc" : "#555"
    }
  }, f)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => scrollTo("contact"),
    style: {
      width: "100%",
      background: pkg.popular ? "#fff" : "#0D0D0D",
      color: pkg.popular ? "#0D0D0D" : "#fff",
      border: "none",
      borderRadius: 10,
      padding: "14px 0",
      fontSize: 15,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, pkg.cta)))))), /*#__PURE__*/React.createElement(Section, {
    className: "py-20 md:py-28 px-6",
    style: {
      background: "#F5F5F0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "#2E7D32",
      letterSpacing: 2,
      textTransform: "uppercase",
      marginBottom: 12
    }
  }, "Process"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "clamp(28px, 4vw, 44px)",
      fontWeight: 800,
      letterSpacing: -1.5,
      marginBottom: 48
    }
  }, "From brief to live in under 7 days."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 24
    }
  }, [{
    step: "01",
    title: "Discovery Call",
    desc: "15-minute call to understand your business, audience, and goals. We define the scope together.",
    time: "Day 0"
  }, {
    step: "02",
    title: "Design Preview",
    desc: "You receive a live preview of your site with your real business name, content, and branding applied.",
    time: "Day 1-2"
  }, {
    step: "03",
    title: "Refine & Build",
    desc: "Your feedback shapes the final design. We build out all pages, forms, and integrations.",
    time: "Day 3-5"
  }, {
    step: "04",
    title: "Launch & Handover",
    desc: "Site goes live on your domain. You get a walkthrough on how to edit content yourself.",
    time: "Day 5-7"
  }].map(({
    step,
    title,
    desc,
    time
  }) => /*#__PURE__*/React.createElement("div", {
    key: step,
    style: {
      padding: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 10,
      background: "#0D0D0D",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      fontWeight: 800
    }
  }, step), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#2E7D32",
      fontWeight: 600
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      marginBottom: 8
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: "#666",
      lineHeight: 1.6
    }
  }, desc)))))), /*#__PURE__*/React.createElement(Section, {
    id: "contact",
    className: "py-20 md:py-28 px-6"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 800,
      margin: "0 auto",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "#2E7D32",
      letterSpacing: 2,
      textTransform: "uppercase",
      marginBottom: 12
    }
  }, "Start a Project"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "clamp(28px, 4vw, 44px)",
      fontWeight: 800,
      letterSpacing: -1.5,
      marginBottom: 16
    }
  }, "Ready to upgrade your online presence?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      color: "#666",
      marginBottom: 40,
      maxWidth: 480,
      margin: "0 auto 40px"
    }
  }, "Send us a message with a brief description of your business and what you need. We respond within 2 hours during business hours."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16,
      maxWidth: 400,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "mailto:hello@dako.studio",
    style: {
      display: "block",
      background: "#0D0D0D",
      color: "#fff",
      borderRadius: 12,
      padding: "16px 32px",
      fontSize: 16,
      fontWeight: 700,
      textDecoration: "none",
      textAlign: "center"
    }
  }, "hello@dako.studio"), /*#__PURE__*/React.createElement("a", {
    href: "https://wa.me/2348000000000",
    style: {
      display: "block",
      background: "#25D366",
      color: "#fff",
      borderRadius: 12,
      padding: "16px 32px",
      fontSize: 16,
      fontWeight: 700,
      textDecoration: "none",
      textAlign: "center"
    }
  }, "WhatsApp Us \u2192")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: "#aaa",
      marginTop: 24
    }
  }, "Based in Abuja, Nigeria \xB7 Serving clients worldwide"))), /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: "1px solid rgba(0,0,0,0.06)",
      padding: "40px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 16
    }
  }, "dako.studio"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#aaa",
      fontSize: 13,
      marginLeft: 12
    }
  }, "\xA9 ", currentYear, " Dako Studios")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 24
    }
  }, ["Twitter", "Instagram", "LinkedIn", "Behance"].map(s => /*#__PURE__*/React.createElement("a", {
    key: s,
    href: "#",
    style: {
      color: "#888",
      fontSize: 13,
      textDecoration: "none",
      fontWeight: 500
    }
  }, s))))));
}
Object.assign(__ds_scope, { DakoStudios });
})(); } catch (e) { __ds_ns.__errors.push({ path: "uploads/dako-studios-landing.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.DakoStudios = __ds_scope.DakoStudios;

})();
