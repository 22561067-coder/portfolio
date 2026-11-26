export function Header({ page = "home" }) {
  function returnToTop(event) {
    if (window.location.hash === "#/" && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }

  return (
    <header className="header">
      <nav className="header-nav" aria-label="메인 메뉴">
        <a href="#/" onClick={returnToTop} aria-current={page === "home" ? "page" : undefined}>PORTFOLIO</a>
        <a href="#/about" aria-current={page === "about" ? "page" : undefined}>ABOUT</a>
        <a href="#/contact" aria-current={page === "contact" ? "page" : undefined}>CONTACT</a>
      </nav>
    </header>
  );
}

export function Footer() {
  return <footer className="subpage-footer"><div className="footer-info"><span>윤서진</span><span>2026 WEB PORTFOLIO</span></div></footer>;
}
