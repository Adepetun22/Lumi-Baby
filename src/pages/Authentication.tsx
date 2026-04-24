import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Mode = "login" | "signup" | "forgot" | "account";
type StrengthLevel = 0 | 1 | 2 | 3 | 4;

interface FieldState {
  value: string;
  error: string;
  valid: boolean;
}

interface AccountInfo {
  name: string;
  email: string;
  initial: string;
}

interface ToastState {
  visible: boolean;
  message: string;
  icon: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const calcStrength = (pw: string): StrengthLevel => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s as StrengthLevel;
};

const STRENGTH_COLORS: Record<StrengthLevel, string> = {
  0: "transparent",
  1: "#D94F4F",
  2: "#C9A96E",
  3: "#8FAF8A",
  4: "#4E8454",
};

const STRENGTH_LABELS: Record<StrengthLevel, string> = {
  0: "Use 8+ characters with letters and numbers",
  1: "Password strength: Too short",
  2: "Password strength: Fair",
  3: "Password strength: Good",
  4: "Password strength: Strong",
};

// ─── SVGs ─────────────────────────────────────────────────────────────────────
const GoogleSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const FacebookSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const ArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);

const CheckCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
  </svg>
);

const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  type?: string;
  value: string;
  placeholder: string;
  autoComplete?: string;
  error: string;
  valid?: boolean;
  onChange: (v: string) => void;
  onBlur?: () => void;
  showToggle?: boolean;
  paddingRight?: boolean;
  children?: React.ReactNode;
}

const Field = ({
  label, type = "text", value, placeholder, autoComplete,
  error, valid, onChange, onBlur,
  showToggle, children,
}: FieldProps) => {
  const [visible, setVisible] = useState(false);
  const inputType = showToggle ? (visible ? "text" : "password") : type;
  const borderColor = error
    ? "var(--red)"
    : valid
    ? "var(--green)"
    : "var(--border)";
  const boxShadow = error
    ? "0 0 0 3px rgba(217,79,79,.08)"
    : valid
    ? "none"
    : "";

  return (
    <div className="field">
      <label>{label}</label>
      <div className="input-wrap">
        <input
          type={inputType}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          style={{
            borderColor,
            boxShadow: error || valid ? boxShadow : undefined,
            paddingRight: showToggle ? 48 : undefined,
          }}
        />
        {showToggle && (
          <button
            className="pw-toggle"
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? "🙈" : "👁"}
          </button>
        )}
      </div>
      {error && <div className="field-msg err show">{error}</div>}
      {children}
    </div>
  );
};

interface CheckBoxProps {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

const CheckBox = ({ checked, onToggle, children, className = "" }: CheckBoxProps) => (
  <div className={`terms-row ${className}`} onClick={onToggle}>
    <div className={`check-box ${checked ? "checked" : ""}`} />
    <div className="terms-text">{children}</div>
  </div>
);

interface SubmitButtonProps {
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "default" | "success";
}

const SubmitButton = ({ loading, disabled, onClick, children, icon, variant = "default" }: SubmitButtonProps) => (
  <button
    className={`btn-submit${loading ? " loading" : ""}${variant === "success" ? " success" : ""}`}
    disabled={disabled || loading}
    onClick={onClick}
  >
    <div className="spinner-sm" />
    <span className="btn-text">{children}</span>
    {!loading && icon}
  </button>
);

const SocialButtons = ({
  googleLabel,
  onGoogle,
  onFacebook,
}: {
  googleLabel: string;
  onGoogle: () => void;
  onFacebook: () => void;
}) => (
  <div className="social-row">
    <button className="social-btn" onClick={onGoogle}>
      <span className="social-icon"><GoogleSVG /></span>
      {googleLabel}
    </button>
    <button className="social-btn" onClick={onFacebook}>
      <span className="social-icon"><FacebookSVG /></span>
      Facebook
    </button>
  </div>
);

const OrDivider = ({ label }: { label: string }) => (
  <div className="or-divider">{label}</div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LumiAuth() {
  const [mode, setMode] = useState<Mode>("login");

  // ── Toast ──
  const [toast, setToast] = useState<ToastState>({ visible: false, message: "", icon: "✓" });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, icon = "✓") => {
    setToast({ visible: true, message, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  }, []);

  // ── Cursor ──
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorGrow, setCursorGrow] = useState(false);
  const mx = useRef(0), my = useRef(0), rx = useRef(0), ry = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX; my.current = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = mx.current + "px";
        cursorRef.current.style.top = my.current + "px";
      }
    };
    const animRing = () => {
      rx.current += (mx.current - rx.current) * 0.12;
      ry.current += (my.current - ry.current) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = rx.current + "px";
        ringRef.current.style.top = ry.current + "px";
      }
      rafRef.current = requestAnimationFrame(animRing);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.closest("button,a,input,.check-box,.terms-row,.acc-action-btn")) {
        setCursorGrow(true);
        if (ringRef.current) ringRef.current.style.opacity = "0";
      }
    };
    const onOut = () => {
      setCursorGrow(false);
      if (ringRef.current) ringRef.current.style.opacity = ".35";
    };
    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    rafRef.current = requestAnimationFrame(animRing);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ─── Auth state ──────────────────────────────────────────────────────────
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [showRedirectBanner, setShowRedirectBanner] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRedirectCountdown = useCallback(() => {
    setShowRedirectBanner(true);
    setCountdown(3);
    let t = 3;
    countdownRef.current = setInterval(() => {
      t--;
      setCountdown(t);
      if (t <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
      }
    }, 1000);
    setTimeout(() => setShowRedirectBanner(false), 3500);
  }, []);

  const handleAuthSuccess = useCallback(
    (name: string, email: string, type: "login" | "signup") => {
      const initial = name.charAt(0).toUpperCase();
      setAccount({ name, email, initial });
      showToast(type === "signup" ? `Welcome to Lumi, ${name}! 🎉` : `Welcome back, ${name}! ✓`, "✦");
      startRedirectCountdown();
      setTimeout(() => setMode("account"), 600);
    },
    [showToast, startRedirectCountdown]
  );

  const handleSocialAuth = useCallback(
    (provider: "google" | "facebook") => {
      const label = provider === "google" ? "Google" : "Facebook";
      showToast(`Connecting to ${label}…`, "🔄");
      const name = provider === "google" ? "Google User" : "Facebook User";
      const email = provider === "google" ? "user@gmail.com" : "user@facebook.com";
      setTimeout(() => handleAuthSuccess(name, email, "login"), 1200);
    },
    [showToast, handleAuthSuccess]
  );

  // ─── Login form ──────────────────────────────────────────────────────────
  const [loginEmail, setLoginEmail] = useState("");
  const [loginEmailErr, setLoginEmailErr] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginPwErr, setLoginPwErr] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const attemptLogin = useCallback(() => {
    setLoginEmailErr("");
    setLoginPwErr("");
    let ok = true;
    if (!isEmail(loginEmail)) { setLoginEmailErr("Please enter a valid email address"); ok = false; }
    if (!loginPw) { setLoginPwErr("Password is required"); ok = false; }
    if (!ok) return;
    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      if (loginPw.length >= 6) {
        const name = loginEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        handleAuthSuccess(name, loginEmail, "login");
      } else {
        setLoginPwErr("Incorrect password. (Hint: use 6+ chars for demo)");
      }
    }, 1400);
  }, [loginEmail, loginPw, handleAuthSuccess]);

  // ─── Signup form ─────────────────────────────────────────────────────────
  const [sigFirst, setSigFirst] = useState("");
  const [sigFirstErr, setSigFirstErr] = useState("");
  const [sigLast, setSigLast] = useState("");
  const [sigLastErr, setSigLastErr] = useState("");
  const [sigEmail, setSigEmail] = useState("");
  const [sigEmailErr, setSigEmailErr] = useState("");
  const [sigPw, setSigPw] = useState("");
  const [sigPwErr, setSigPwErr] = useState("");
  const [sigConfirm, setSigConfirm] = useState("");
  const [sigConfirmErr, setSigConfirmErr] = useState("");
  const [sigConfirmOk, setSigConfirmOk] = useState(false);
  const [strength, setStrength] = useState<StrengthLevel>(0);
  const [termsChecked, setTermsChecked] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const handlePwChange = (v: string) => {
    setSigPw(v);
    setSigPwErr("");
    setStrength(calcStrength(v));
    // recheck confirm
    if (sigConfirm) {
      if (v === sigConfirm) { setSigConfirmErr(""); setSigConfirmOk(true); }
      else { setSigConfirmOk(false); setSigConfirmErr("Passwords don't match"); }
    }
  };

  const handleConfirmChange = (v: string) => {
    setSigConfirm(v);
    if (v === sigPw) { setSigConfirmErr(""); setSigConfirmOk(true); }
    else { setSigConfirmOk(false); if (v) setSigConfirmErr("Passwords don't match"); }
  };

  const attemptSignup = useCallback(() => {
    let ok = true;
    setSigFirstErr(""); setSigLastErr(""); setSigEmailErr(""); setSigPwErr(""); setSigConfirmErr("");
    if (!sigFirst.trim()) { setSigFirstErr("Required"); ok = false; }
    if (!sigLast.trim()) { setSigLastErr("Required"); ok = false; }
    if (!isEmail(sigEmail)) { setSigEmailErr("Enter a valid email"); ok = false; }
    if (sigPw.length < 8) { setSigPwErr("Min 8 characters required"); ok = false; }
    if (sigPw !== sigConfirm) { setSigConfirmErr("Passwords don't match"); setSigConfirmOk(false); ok = false; }
    if (!ok) return;
    setSignupLoading(true);
    setTimeout(() => {
      setSignupLoading(false);
      handleAuthSuccess(sigFirst, sigEmail, "signup");
    }, 1600);
  }, [sigFirst, sigLast, sigEmail, sigPw, sigConfirm, handleAuthSuccess]);

  // ─── Forgot password ─────────────────────────────────────────────────────
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailErr, setResetEmailErr] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleForgotClick = () => {
    setResetEmail(loginEmail);
    setResetSent(false);
    setMode("forgot");
  };

  const handleReset = () => {
    setResetEmailErr("");
    if (!isEmail(resetEmail)) { setResetEmailErr("Please enter a valid email"); return; }
    setResetLoading(true);
    setTimeout(() => {
      setResetLoading(false);
      setResetSent(true);
      showToast("Reset link sent!", "📬");
    }, 1200);
  };

  // ─── Mode helpers ─────────────────────────────────────────────────────────
  const goLogin = () => setMode("login");
  const goSignup = () => setMode("signup");

  const handleSignOut = () => {
    setAccount(null);
    setMode("login");
    setLoginEmail(""); setLoginPw("");
    showToast("Signed out successfully", "✓");
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Inject Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');

        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{
          --cream:#FDF6EE; --warm-white:#FFFAF5;
          --blush:#F2C4B2; --blush-light:#FDE8E0;
          --sage:#8FAF8A; --sage-dark:#5C7A57;
          --clay:#C97B5A; --clay-light:#EDD5C8; --clay-deep:#A35E41;
          --gold:#C9A96E;
          --charcoal:#2C2C2C;
          --muted:#7A7068; --muted-light:#A89E96;
          --border:rgba(201,123,90,.14); --border-soft:rgba(44,44,44,.07);
          --red:#D94F4F; --red-light:#FDEAEA;
          --green:#4E8454; --green-light:#E8F5EA;
          --font-display:'Cormorant Garamond',serif;
          --font-body:'DM Sans',sans-serif;
          --ease:cubic-bezier(.22,1,.36,1);
          --ease-back:cubic-bezier(.34,1.56,.64,1);
        }
        html,body{height:100%;overflow-x:hidden}
        body{background:var(--cream);color:var(--charcoal);font-family:var(--font-body);cursor:none}

        /* Cursor */
        .cursor{width:10px;height:10px;background:var(--clay);border-radius:50%;position:fixed;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .2s var(--ease),height .2s var(--ease),background .25s;mix-blend-mode:multiply}
        .cursor.grow{width:48px;height:48px;background:rgba(201,123,90,.12);mix-blend-mode:normal}
        .cursor-ring{width:36px;height:36px;border:1.5px solid var(--clay);border-radius:50%;position:fixed;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);opacity:.35;transition:opacity .3s}

        /* Toast */
        .toast{position:fixed;bottom:28px;left:50%;z-index:9100;transform:translateX(-50%) translateY(14px);background:var(--charcoal);color:#fff;padding:12px 24px;border-radius:50px;font-size:13px;display:flex;align-items:center;gap:9px;box-shadow:0 8px 32px rgba(44,44,44,.22);opacity:0;pointer-events:none;transition:opacity .32s,transform .38s var(--ease);white-space:nowrap}
        .toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

        /* Layout */
        .auth-root{display:grid;grid-template-columns:1fr 1fr;min-height:100vh}

        /* Left panel */
        .left-panel{position:relative;overflow:hidden;background:var(--charcoal);display:flex;flex-direction:column;justify-content:space-between;padding:48px}
        .left-panel::after{content:'';position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");opacity:.4;pointer-events:none;z-index:0}
        .orb{position:absolute;border-radius:50%;pointer-events:none;mix-blend-mode:screen}
        .orb-1{width:560px;height:560px;background:radial-gradient(circle,rgba(201,123,90,.55),transparent 70%);top:-100px;left:-100px;animation:orbDrift1 12s ease-in-out infinite}
        .orb-2{width:420px;height:420px;background:radial-gradient(circle,rgba(143,175,138,.45),transparent 70%);bottom:-80px;right:-80px;animation:orbDrift2 15s ease-in-out infinite}
        .orb-3{width:280px;height:280px;background:radial-gradient(circle,rgba(242,196,178,.3),transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);animation:orbDrift3 9s ease-in-out infinite}
        @keyframes orbDrift1{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(40px,-30px) scale(1.08)}70%{transform:translate(-20px,20px) scale(.95)}}
        @keyframes orbDrift2{0%,100%{transform:translate(0,0)}50%{transform:translate(-30px,25px) scale(1.06)}}
        @keyframes orbDrift3{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.3)}}
        .deco-shape{position:absolute;pointer-events:none;z-index:1;border-radius:50%;border:1px solid rgba(255,255,255,.06)}
        .deco-1{width:200px;height:200px;top:30%;right:-60px;animation:rotateDeco 20s linear infinite}
        .deco-2{width:120px;height:120px;top:15%;left:55%;animation:rotateDeco 14s linear infinite reverse}
        @keyframes rotateDeco{to{transform:rotate(360deg)}}
        .left-top{position:relative;z-index:2}
        .left-logo{font-family:var(--font-display);font-size:28px;font-weight:300;color:var(--cream);letter-spacing:.06em;text-decoration:none;display:inline-flex;align-items:center;gap:7px}
        .left-logo em{color:var(--blush);font-style:normal}
        .left-main{position:relative;z-index:2;flex:1;display:flex;flex-direction:column;justify-content:center;padding:40px 0}
        .left-eyebrow{font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:rgba(253,246,238,.45);margin-bottom:16px;display:flex;align-items:center;gap:12px}
        .left-eyebrow::before{content:'';width:20px;height:1px;background:rgba(253,246,238,.3)}
        .left-heading{font-family:var(--font-display);font-size:clamp(44px,4.5vw,72px);font-weight:300;line-height:1.05;color:var(--cream);margin-bottom:20px;letter-spacing:-.02em}
        .left-heading em{font-style:italic;color:var(--blush)}
        .left-desc{font-size:14px;color:rgba(253,246,238,.6);line-height:1.8;max-width:380px;margin-bottom:36px}
        .feature-list{display:flex;flex-direction:column;gap:14px}
        .feature-item{display:flex;align-items:center;gap:12px;opacity:0;transform:translateX(-16px);animation:featureIn .5s var(--ease) forwards}
        .feature-item:nth-child(1){animation-delay:.1s}.feature-item:nth-child(2){animation-delay:.2s}.feature-item:nth-child(3){animation-delay:.3s}.feature-item:nth-child(4){animation-delay:.4s}
        @keyframes featureIn{to{opacity:1;transform:translateX(0)}}
        .feat-icon{width:36px;height:36px;border-radius:10px;flex-shrink:0;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:16px}
        .feat-text{font-size:13px;color:rgba(253,246,238,.65);line-height:1.4}
        .feat-text strong{color:var(--cream);font-weight:500}
        .left-testimonial{position:relative;z-index:2;padding:20px 22px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:16px;backdrop-filter:blur(8px)}
        .test-stars{color:var(--gold);font-size:13px;margin-bottom:8px;letter-spacing:2px}
        .test-quote{font-family:var(--font-display);font-size:16px;font-weight:400;font-style:italic;color:rgba(253,246,238,.75);line-height:1.6;margin-bottom:12px}
        .test-author{display:flex;align-items:center;gap:10px}
        .test-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--blush),var(--clay));display:flex;align-items:center;justify-content:center;font-size:14px}
        .test-name{font-size:12px;color:rgba(253,246,238,.5)}

        /* Right panel */
        .right-panel{display:flex;flex-direction:column;justify-content:center;align-items:center;padding:48px 52px;background:var(--cream);position:relative;overflow:hidden}
        .right-panel::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 60% 50% at 110% 0%,rgba(242,196,178,.18),transparent 60%),radial-gradient(ellipse 40% 40% at -10% 100%,rgba(143,175,138,.12),transparent 55%)}
        .form-container{width:100%;max-width:440px;position:relative;z-index:2}

        /* Mode toggle */
        .mode-toggle{display:flex;background:var(--warm-white);border:1px solid var(--border);border-radius:14px;padding:4px;gap:2px;margin-bottom:36px}
        .mode-btn{flex:1;padding:11px 16px;border-radius:10px;border:none;background:transparent;font-family:var(--font-body);font-size:13px;font-weight:500;cursor:pointer;color:var(--muted);transition:all .3s var(--ease);letter-spacing:.02em}
        .mode-btn.active{background:var(--charcoal);color:#fff;box-shadow:0 4px 16px rgba(44,44,44,.18)}

        /* Form header */
        .form-header{margin-bottom:28px}
        .form-eyebrow{font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:var(--clay);margin-bottom:8px;font-weight:500;display:flex;align-items:center;gap:10px}
        .form-eyebrow::before{content:'';width:18px;height:1px;background:var(--clay)}
        .form-title{font-family:var(--font-display);font-size:clamp(28px,3vw,42px);font-weight:400;line-height:1.1;color:var(--charcoal)}
        .form-title em{font-style:italic;color:var(--clay)}
        .form-subtitle{font-size:13px;color:var(--muted);margin-top:8px;line-height:1.6}
        .form-subtitle a{color:var(--clay);text-decoration:none;font-weight:500;background:none;border:none;cursor:pointer;font-family:var(--font-body);font-size:13px}
        .form-subtitle a:hover{text-decoration:underline}

        /* Social */
        .social-row{display:flex;gap:10px;margin-bottom:22px}
        .social-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:9px;padding:12px 14px;border-radius:12px;border:1.5px solid var(--border);background:var(--warm-white);cursor:pointer;font-family:var(--font-body);font-size:13px;font-weight:500;color:var(--charcoal);transition:all .25s}
        .social-btn:hover{border-color:var(--charcoal);background:var(--charcoal);color:#fff;transform:translateY(-1px);box-shadow:0 6px 20px rgba(44,44,44,.12)}
        .social-icon{font-size:18px;flex-shrink:0;display:flex;align-items:center}
        .or-divider{display:flex;align-items:center;gap:14px;font-size:11px;color:var(--muted-light);letter-spacing:.1em;text-transform:uppercase;margin-bottom:22px}
        .or-divider::before,.or-divider::after{content:'';flex:1;height:1px;background:var(--border)}

        /* Fields */
        .field-group{display:flex;flex-direction:column;gap:14px;margin-bottom:6px}
        .field{display:flex;flex-direction:column;gap:5px;position:relative}
        .field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .field label{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:500;transition:color .2s}
        .field:focus-within label{color:var(--clay)}
        .input-wrap{position:relative}
        .field input{width:100%;padding:13px 16px;border-radius:12px;border:1.5px solid var(--border);background:var(--warm-white);font-family:var(--font-body);font-size:14px;color:var(--charcoal);outline:none;transition:border-color .25s,box-shadow .25s,background .2s}
        .field input:focus{border-color:var(--clay);box-shadow:0 0 0 3px rgba(201,123,90,.1);background:#fff}
        .field input::placeholder{color:var(--muted-light);opacity:.8}
        .pw-toggle{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--muted);font-size:14px;padding:4px;transition:color .2s;line-height:1}
        .pw-toggle:hover{color:var(--clay)}
        .strength-bar{height:3px;background:var(--border);border-radius:3px;margin-top:6px;overflow:hidden}
        .strength-fill{height:100%;border-radius:3px;transition:width .4s var(--ease),background .4s}
        .field-msg{font-size:11px;margin-top:3px;display:none;align-items:center;gap:5px}
        .field-msg.show{display:flex}
        .field-msg.err{color:var(--red)}
        .field-msg.ok{color:var(--green)}
        .field-msg.hint{color:var(--muted)}

        /* Check/terms */
        .terms-row{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:10px;border:1.5px solid transparent;cursor:pointer;margin-bottom:4px;transition:background .2s,border-color .2s}
        .terms-row:hover{background:var(--blush-light);border-color:var(--border)}
        .check-box{width:18px;height:18px;border-radius:5px;flex-shrink:0;border:2px solid var(--border);margin-top:1px;display:flex;align-items:center;justify-content:center;transition:all .25s var(--ease-back)}
        .check-box.checked{background:var(--sage-dark);border-color:var(--sage-dark)}
        .check-box.checked::after{content:'✓';color:#fff;font-size:10px;font-weight:700}
        .terms-text{font-size:12px;color:var(--muted);line-height:1.6}
        .terms-text a{color:var(--clay);text-decoration:underline}

        /* Login meta */
        .login-meta{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;margin-top:12px}
        .remember-row{display:flex;align-items:center;gap:8px;cursor:pointer}
        .remember-text{font-size:12px;color:var(--muted)}
        .forgot-link{font-size:12px;color:var(--clay);background:none;border:none;cursor:pointer;font-family:var(--font-body);transition:opacity .2s}
        .forgot-link:hover{opacity:.7;text-decoration:underline}

        /* Submit button */
        .btn-submit{width:100%;padding:15px;border-radius:50px;border:none;background:var(--clay);color:#fff;font-family:var(--font-body);font-size:13px;letter-spacing:.12em;text-transform:uppercase;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;transition:background .3s,transform .25s var(--ease),box-shadow .3s;position:relative;overflow:hidden;margin-top:18px}
        .btn-submit::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.12),transparent);pointer-events:none}
        .btn-submit:hover:not(:disabled){background:var(--clay-deep);transform:translateY(-2px);box-shadow:0 14px 36px rgba(201,123,90,.32)}
        .btn-submit:disabled{background:var(--muted-light);transform:none;box-shadow:none;cursor:not-allowed}
        .btn-submit.success{background:var(--sage-dark)}
        .spinner-sm{width:16px;height:16px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:none;flex-shrink:0}
        @keyframes spin{to{transform:rotate(360deg)}}
        .btn-submit.loading .spinner-sm{display:block}
        .btn-submit.loading .btn-text{opacity:.7}

        /* Redirect banner */
        .redirect-banner{padding:10px 16px;background:var(--warm-white);border:1px solid var(--border);border-radius:10px;font-size:12px;color:var(--muted);text-align:center;margin-bottom:20px;opacity:0;max-height:0;overflow:hidden;transition:opacity .3s,max-height .3s}
        .redirect-banner.show{opacity:1;max-height:60px}
        .redirect-banner strong{color:var(--charcoal)}
        .redirect-countdown{display:inline-block;background:var(--clay);color:#fff;width:20px;height:20px;border-radius:50%;font-size:10px;font-weight:700;line-height:20px;text-align:center;margin-left:4px}

        /* Forgot panel */
        .forgot-panel{animation:panelIn .4s var(--ease) both}
        @keyframes panelIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .back-to-login{display:inline-flex;align-items:center;gap:7px;background:none;border:none;cursor:pointer;font-family:var(--font-body);font-size:12px;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;padding:0;margin-bottom:24px;transition:color .2s}
        .back-to-login:hover{color:var(--clay)}
        .reset-sent{text-align:center;padding:28px;background:var(--green-light);border:1px solid rgba(78,132,84,.15);border-radius:16px;margin-top:16px}
        .reset-sent-icon{font-size:40px;margin-bottom:12px}
        .reset-sent h3{font-family:var(--font-display);font-size:22px;font-weight:400;margin-bottom:8px}
        .reset-sent p{font-size:13px;color:var(--muted);line-height:1.7}

        /* Account panel */
        .account-panel{text-align:center;animation:panelIn .5s var(--ease) both}
        .account-avatar{width:76px;height:76px;border-radius:50%;margin:0 auto 16px;background:linear-gradient(135deg,var(--clay-light),var(--clay));display:flex;align-items:center;justify-content:center;font-size:32px;box-shadow:0 0 0 8px rgba(201,123,90,.1),0 0 0 16px rgba(201,123,90,.05);animation:avatarPop .5s .1s var(--ease-back) both}
        @keyframes avatarPop{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
        .account-welcome{font-family:var(--font-display);font-size:28px;font-weight:400;margin-bottom:6px}
        .account-welcome em{font-style:italic;color:var(--clay)}
        .account-email{font-size:13px;color:var(--muted);margin-bottom:24px}
        .account-actions{display:flex;flex-direction:column;gap:10px}
        .acc-action-btn{display:flex;align-items:center;gap:10px;padding:14px 18px;border-radius:12px;border:1.5px solid var(--border);background:var(--warm-white);cursor:pointer;font-family:var(--font-body);font-size:13px;font-weight:500;color:var(--charcoal);text-decoration:none;transition:all .25s}
        .acc-action-btn:hover{border-color:var(--clay);background:var(--blush-light);color:var(--clay-deep)}
        .acc-action-btn .acc-icon{font-size:18px;flex-shrink:0}
        .acc-action-btn .acc-label{flex:1;text-align:left}
        .acc-action-btn .acc-arrow{color:var(--muted);font-size:16px}
        .acc-action-btn.primary{background:var(--clay);color:#fff;border-color:var(--clay)}
        .acc-action-btn.primary:hover{background:var(--clay-deep)}
        .sign-out-btn{margin-top:12px;background:none;border:none;font-family:var(--font-body);font-size:12px;color:var(--muted-light);cursor:pointer;letter-spacing:.06em;text-decoration:underline;transition:color .2s;display:block;margin-left:auto;margin-right:auto}
        .sign-out-btn:hover{color:var(--red)}

        /* Auth footer */
        .auth-footer{margin-top:24px;text-align:center;font-size:12px;color:var(--muted)}
        .auth-footer button{color:var(--clay);background:none;border:none;cursor:pointer;font-family:var(--font-body);font-size:12px;font-weight:500;text-decoration:none}
        .auth-footer button:hover{text-decoration:underline}

        /* Form section animation */
        .form-section{animation:sectionIn .45s var(--ease) both}
        @keyframes sectionIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

        /* Mobile */
        .mobile-logo{display:none}
        @media(max-width:860px){
          .auth-root{grid-template-columns:1fr}
          .left-panel{display:none}
          .right-panel{padding:40px 28px;min-height:100vh;justify-content:flex-start;padding-top:60px}
          .form-container{max-width:100%}
          .mobile-logo{display:flex;align-items:center;gap:8px;font-family:var(--font-display);font-size:24px;font-weight:300;color:var(--charcoal);text-decoration:none;margin-bottom:32px;letter-spacing:.05em}
          .mobile-logo em{color:var(--clay);font-style:normal}
          .field-row{grid-template-columns:1fr}
        }
        @media(max-width:480px){
          .right-panel{padding:32px 18px}
          .social-row{flex-direction:column}
          .form-title{font-size:26px}
        }
      `}</style>

      {/* Custom cursor */}
      <div ref={cursorRef} className={`cursor${cursorGrow ? " grow" : ""}`} />
      <div ref={ringRef} className="cursor-ring" />

      {/* Toast */}
      <div className={`toast${toast.visible ? " show" : ""}`}>
        <span>{toast.icon}</span>
        <span>{toast.message}</span>
      </div>

      <div className="auth-root">

        {/* ═══ LEFT PANEL ═══ */}
        <div className="left-panel">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="deco-shape deco-1" />
          <div className="deco-shape deco-2" />
          <div className="left-top">
            <a href="/" className="left-logo">Lumi<em>✦</em>Baby</a>
          </div>
          <div className="left-main">
            <div className="left-eyebrow">Welcome to Lumi Baby</div>
            <h2 className="left-heading">Your <em>family's</em><br />favourite store</h2>
            <p className="left-desc">Join over 50,000 families who trust Lumi Baby for premium, organic products designed with love and tested for safety.</p>
            <div className="feature-list">
              {[
                { icon: "🛍", title: "Order tracking", desc: "Know exactly where your parcels are at all times" },
                { icon: "♡", title: "Wishlist & saves", desc: "Save your favourite products across devices" },
                { icon: "✦", title: "Lumi Rewards", desc: "Earn points on every purchase, redeem for discounts" },
                { icon: "🎁", title: "Early access", desc: "Be first to shop new arrivals and exclusive sales" },
              ].map((f) => (
                <div className="feature-item" key={f.title}>
                  <div className="feat-icon">{f.icon}</div>
                  <div className="feat-text"><strong>{f.title}</strong> — {f.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="left-testimonial">
            <div className="test-stars">★★★★★</div>
            <p className="test-quote">"Shopping on Lumi is genuinely a joy. The account makes reordering our favourites so effortless — it knows what we need."</p>
            <div className="test-author">
              <div className="test-avatar">👩</div>
              <div className="test-name">Elena K. — Verified Customer · Seattle, WA</div>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT PANEL ═══ */}
        <div className="right-panel">
          <div className="form-container">

            {/* Mobile logo */}
            <a href="/" className="mobile-logo">Lumi<em>✦</em>Baby</a>

            {/* Redirect banner */}
            <div className={`redirect-banner${showRedirectBanner ? " show" : ""}`}>
              Redirecting you to <strong>your account</strong> in{" "}
              <span className="redirect-countdown">{countdown}</span>s
            </div>

            {/* Mode toggle */}
            {mode !== "forgot" && mode !== "account" && (
              <div className="mode-toggle">
                <button className={`mode-btn${mode === "login" ? " active" : ""}`} onClick={goLogin}>Sign In</button>
                <button className={`mode-btn${mode === "signup" ? " active" : ""}`} onClick={goSignup}>Create Account</button>
              </div>
            )}

            {/* ── LOGIN ── */}
            {mode === "login" && (
              <div className="form-section" key="login">
                <div className="form-header">
                  <div className="form-eyebrow">Welcome back</div>
                  <h1 className="form-title">Sign in to <em>Lumi</em></h1>
                  <p className="form-subtitle">
                    New to Lumi?{" "}
                    <button className="form-subtitle a" onClick={goSignup}>Create a free account →</button>
                  </p>
                </div>
                <SocialButtons googleLabel="Continue with Google" onGoogle={() => handleSocialAuth("google")} onFacebook={() => handleSocialAuth("facebook")} />
                <OrDivider label="or continue with email" />
                <div className="field-group">
                  <Field
                    label="Email Address" type="email" value={loginEmail}
                    placeholder="your@email.com" autoComplete="email"
                    error={loginEmailErr} onChange={(v) => { setLoginEmail(v); setLoginEmailErr(""); }}
                    onBlur={() => { if (loginEmail && !isEmail(loginEmail)) setLoginEmailErr("Please enter a valid email address"); }}
                  />
                  <Field
                    label="Password" value={loginPw}
                    placeholder="Enter your password" autoComplete="current-password"
                    error={loginPwErr} showToggle
                    onChange={(v) => { setLoginPw(v); setLoginPwErr(""); }}
                    onBlur={() => {}}
                  />
                </div>
                <div className="login-meta">
                  <div className="remember-row" onClick={() => setRemember((r) => !r)}>
                    <div className={`check-box${remember ? " checked" : ""}`} />
                    <span className="remember-text">Remember me</span>
                  </div>
                  <button className="forgot-link" onClick={handleForgotClick}>Forgot password?</button>
                </div>
                <SubmitButton loading={loginLoading} onClick={attemptLogin} icon={<ArrowRight />}>Sign In</SubmitButton>
                <div className="auth-footer">
                  Don't have an account?{" "}
                  <button onClick={goSignup}>Sign up free</button>
                </div>
              </div>
            )}

            {/* ── SIGN UP ── */}
            {mode === "signup" && (
              <div className="form-section" key="signup">
                <div className="form-header">
                  <div className="form-eyebrow">Join 50,000+ families</div>
                  <h1 className="form-title">Create your <em>account</em></h1>
                  <p className="form-subtitle">
                    Already have one?{" "}
                    <button className="form-subtitle a" onClick={goLogin}>Sign in →</button>
                  </p>
                </div>
                <SocialButtons googleLabel="Sign up with Google" onGoogle={() => handleSocialAuth("google")} onFacebook={() => handleSocialAuth("facebook")} />
                <OrDivider label="or fill in the form" />
                <div className="field-group">
                  <div className="field-row">
                    <Field label="First Name" value={sigFirst} placeholder="Sarah" autoComplete="given-name" error={sigFirstErr} onChange={(v) => { setSigFirst(v); setSigFirstErr(""); }} />
                    <Field label="Last Name" value={sigLast} placeholder="Mitchell" autoComplete="family-name" error={sigLastErr} onChange={(v) => { setSigLast(v); setSigLastErr(""); }} />
                  </div>
                  <Field
                    label="Email Address" type="email" value={sigEmail}
                    placeholder="your@email.com" autoComplete="email"
                    error={sigEmailErr} onChange={(v) => { setSigEmail(v); setSigEmailErr(""); }}
                    onBlur={() => { if (sigEmail && !isEmail(sigEmail)) setSigEmailErr("Enter a valid email"); }}
                  />
                  <Field
                    label="Password" value={sigPw}
                    placeholder="Create a strong password" autoComplete="new-password"
                    error={sigPwErr} showToggle onChange={handlePwChange}
                  >
                    <div className="strength-bar">
                      <div className="strength-fill" style={{ width: `${[0, 25, 50, 75, 100][strength]}%`, background: STRENGTH_COLORS[strength] }} />
                    </div>
                    {sigPw && <div className="field-msg hint show">{STRENGTH_LABELS[strength]}</div>}
                  </Field>
                  <Field
                    label="Confirm Password" value={sigConfirm}
                    placeholder="Repeat your password" autoComplete="new-password"
                    error={sigConfirmErr} showToggle onChange={handleConfirmChange}
                  >
                    {sigConfirmOk && !sigConfirmErr && <div className="field-msg ok show">✓ Passwords match</div>}
                  </Field>
                </div>
                <CheckBox checked={termsChecked} onToggle={() => setTermsChecked((t) => !t)} className="mt-2">
                  I agree to the <a href="#">Terms of Service</a>, <a href="#">Privacy Policy</a>, and confirm I am 18+.
                </CheckBox>
                <SubmitButton loading={signupLoading} disabled={!termsChecked} onClick={attemptSignup} icon={<CheckCircle />}>Create Account</SubmitButton>
                <div className="auth-footer">
                  Already registered?{" "}
                  <button onClick={goLogin}>Sign in here</button>
                </div>
              </div>
            )}

            {/* ── FORGOT PASSWORD ── */}
            {mode === "forgot" && (
              <div className="forgot-panel" key="forgot">
                <button className="back-to-login" onClick={goLogin}>
                  <ArrowLeft /> Back to Sign In
                </button>
                <div className="form-header">
                  <div className="form-eyebrow">Account Recovery</div>
                  <h1 className="form-title">Reset your <em>password</em></h1>
                  <p className="form-subtitle">Enter your email and we'll send a secure reset link within a minute.</p>
                </div>
                {!resetSent ? (
                  <>
                    <div className="field-group">
                      <Field
                        label="Email Address" type="email" value={resetEmail}
                        placeholder="your@email.com" autoComplete="email"
                        error={resetEmailErr} onChange={(v) => { setResetEmail(v); setResetEmailErr(""); }}
                      />
                    </div>
                    <SubmitButton loading={resetLoading} onClick={handleReset} icon={<SendIcon />}>Send Reset Link</SubmitButton>
                  </>
                ) : (
                  <div className="reset-sent">
                    <div className="reset-sent-icon">📬</div>
                    <h3>Check your inbox</h3>
                    <p>We've sent a password reset link to <strong>{resetEmail}</strong>. It'll arrive within 60 seconds.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── ACCOUNT DASHBOARD ── */}
            {mode === "account" && account && (
              <div className="account-panel" key="account">
                <div className="account-avatar">{account.initial}</div>
                <div className="account-welcome">Welcome back, <em>{account.name}</em></div>
                <div className="account-email">{account.email}</div>
                <div className="account-actions">
                  {[
                    { icon: "🛍", label: "Continue Shopping", href: "/shop", primary: true },
                    { icon: "📦", label: "My Orders", href: "#" },
                    { icon: "♡", label: "My Wishlist", href: "#" },
                    { icon: "✦", label: "Lumi Rewards — 0 points", href: "#" },
                    { icon: "⚙", label: "Account Settings", href: "#" },
                  ].map((a) => (
                    <a key={a.label} href={a.href} className={`acc-action-btn${a.primary ? " primary" : ""}`}>
                      <span className="acc-icon">{a.icon}</span>
                      <span className="acc-label">{a.label}</span>
                      <span className="acc-arrow">→</span>
                    </a>
                  ))}
                </div>
                <button className="sign-out-btn" onClick={handleSignOut}>Sign out</button>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
