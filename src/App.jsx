import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Header } from "./Layout";
import Subpage from "./Subpage";
import ProjectStudy from "./ProjectStudy";
import tteokwikiPreview from "./assets/tteokwiki-preview.png";
import chocobowlPreview from "./assets/chocobowl-preview.png";
import raindropPreview from "./assets/raindrop-preview.png";
import formePreview from "./assets/forme-preview.png";
const projects = [
  { number: "01", title: "떡위키", description: "다양한 떡의 종류와 레시피, 보관법을 탐색하는 떡 정보 웹사이트", url: null, year: "2026", category: "WEB / JAVASCRIPT", image: tteokwikiPreview, imageAlt: "떡위키 메인 페이지 — 인기 떡과 추천 정보" },
  { number: "02", title: "CHOCOBOWL", description: "Matter.js 충돌 계산과 Canvas 2D 렌더링으로 구현한 초코볼 게임 — 통의 회전·속도 보정·수집 판정으로 조작감을 설계", study: true, url: null, year: "2026", category: "GAME / JAVASCRIPT", image: chocobowlPreview, imageAlt: "CHOCOBOWL — 통을 회전시켜 초코볼을 담는 게임" },
  { number: "03", title: "RAINDROP", description: "Three.js·GLSL로 표현한 수면 파문과 선택한 빗방울의 가속 낙하, Web Audio로 합성한 빗소리를 연결한 인터랙티브 웹 실험", study: true, url: "https://22561067-coder.github.io/raindrop/", year: "2025", category: "WEB / REACT", image: raindropPreview, imageAlt: "RAINDROP — 빗방울과 수면의 파문 인터랙션" },
  { number: "04", title: "FORME", description: "순수 JavaScript와 CSS로 구현한 양방향 포스터 트랙·스크롤 반응·포스터 편집과 SVG 저장 기능을 갖춘 디자인 플레이그라운드", study: true, url: "https://22561067-coder.github.io/forme/", year: "2025", category: "INTERACTION / JS", image: formePreview, imageAlt: "FORME — 타이포그래피와 그래픽 포스터로 구성한 디자인 플레이그라운드" },
];
const skills = [["HTML / CSS",35],["JAVASCRIPT",30],["REACT",25],["SVG",20],["UI / INTERACTION",55]];
const motion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
function Home() {
  const appRef = useRef(null);
  const trackRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [position, setPosition] = useState({ start: true, end: false });
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const repeat = entry.target.matches(".skills-heading, .skill-item");
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          entry.target.classList.add("is-visible");
          if (!repeat) observer.unobserve(entry.target);
        } else if (repeat && !entry.isIntersecting) {
          entry.target.classList.remove("is-visible");
        }
      });
    }, { threshold: [0, 0.15] });
    appRef.current.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    const track = trackRef.current;
    const update = () => setPosition({start: track.scrollLeft <= 1, end: track.scrollLeft >= track.scrollWidth - track.clientWidth - 2});
    const resize = new ResizeObserver(update);
    resize.observe(track);
    const wheel = event => {
      if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const max = track.scrollWidth - track.clientWidth;
      if ((event.deltaY > 0 && track.scrollLeft < max - 1) || (event.deltaY < 0 && track.scrollLeft > 1)) {
        event.preventDefault();
        const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? track.clientWidth : 1;
        track.scrollBy({left: event.deltaY * unit * 1.4, behavior: motion()});
      }
    };
    track.addEventListener("wheel", wheel, {passive:false});
    track.addEventListener("scroll", update, {passive:true});
    return () => { observer.disconnect(); resize.disconnect(); track.removeEventListener("wheel",wheel); track.removeEventListener("scroll",update); };
  }, []);
  const move = direction => {
    const track = trackRef.current;
    track.scrollBy({left: direction * (track.querySelector(".project").getBoundingClientRect().width + 25), behavior: motion()});
  };
  return (
    <div className="app" ref={appRef} id="top">
      <Header />
      <main tabIndex={-1}>
        <section className="hero">
          <h1><span>BUILT BY DOING</span></h1>
          <div className="hero-bottom"><p>윤서진<br/>2026 WEB PORTFOLIO</p><a className="scroll-cue" href="#work">EXPLORE WORK <span aria-hidden="true">↓</span></a></div>
        </section>
        <section className="skills" id="about">
          <div className="skills-heading reveal"><span>SKILLS</span></div>
          <div className="skills-list">{skills.map(([name,level],index) => (
            <div className="skill-item reveal" key={name} style={{"--delay":`${index * 65}ms`}}>
              <div className="skill-info"><span>{name}</span><span>{level}%</span></div>
              <div className="skill-bar"><div className="skill-level" style={{width:`${level}%`}} /></div>
            </div>
          ))}</div>
        </section>
        <section className="portfolio" id="work">
          <div className="section-title reveal"><span>SELECTED WORK / 01 — 04</span><div className="track-controls">
            <button type="button" onClick={() => move(-1)} disabled={position.start} aria-label="이전 프로젝트" aria-controls="project-track">←</button>
            <button type="button" onClick={() => move(1)} disabled={position.end} aria-label="다음 프로젝트" aria-controls="project-track">→</button>
          </div></div>
          <div className="project-track" id="project-track" ref={trackRef} tabIndex={0} role="region" aria-label="프로젝트 목록. 좌우 방향키로 이동할 수 있습니다.">
            {projects.map(project => <article className="project" key={project.number} tabIndex={0} aria-label={`${project.title} 프로젝트`} aria-describedby={`project-description-${project.number}`}>
              <div className={`project-image${project.image ? " has-preview" : ""}`}>{project.image ? <img className="project-preview" src={project.image} alt={project.imageAlt} loading="lazy" width="2502" height="1418" /> : <><div className="image-grid"/><span className="project-number">{project.number}</span></>}
                <div className="project-overlay">
                  <span className="project-overlay-label">{project.study ? "DESIGN & DEVELOPMENT" : "ABOUT THE PROJECT"}</span>
                  <h3>{project.title}</h3>
                  <p id={`project-description-${project.number}`}>{project.description}</p>
                  {project.study && <button className="project-study-open" type="button" onClick={() => setSelectedProject(project)} aria-haspopup="dialog">구현 과정 보기 <span aria-hidden="true">＋</span></button>}
                  {project.url ? <a className="project-visit" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} 사이트 바로가기 (새 탭)`}>사이트 바로가기 <span aria-hidden="true">↗</span></a> : <span className="project-link-pending">사이트 링크 준비 중</span>}
                </div>
              </div>
              <div className="project-info"><div className="project-main"><h2>{project.title}</h2></div><div className="project-meta"><span>{project.category}</span><span>{project.year}</span></div></div>
            </article>)}
          </div>
        </section>
      </main>
      {selectedProject && <ProjectStudy project={selectedProject} onClose={() => setSelectedProject(null)} />}
      <footer id="contact" className="reveal"><div className="footer-info"><span>윤서진</span><span>Programer</span><a href="mailto:22561067@kaywon.ac.kr">22561067@kaywon.ac.kr ↗</a></div><a href="#top" className="logo">PORTFOLIO</a></footer>
    </div>
  );
}
function App() {
  const [page, setPage] = useState(() => getPage());
  useEffect(() => {
    const navigate = () => {
      const next = getPage();
      setPage(next);
      if (window.location.hash.startsWith("#/")) {
        window.scrollTo({ top: 0, behavior: "instant" });
        requestAnimationFrame(() => document.querySelector("main")?.focus({ preventScroll: true }));
      }
    };
    window.addEventListener("hashchange", navigate);
    return () => window.removeEventListener("hashchange", navigate);
  }, []);
  useEffect(() => {
    document.title = `${page === "home" ? "Portfolio" : page.toUpperCase()} — 윤서진`;
  }, [page]);
  return page === "home" ? <Home /> : <Subpage key={page} page={page} />;
}
function getPage() {
  const route = window.location.hash;
  return route === "#/about" ? "about" : route === "#/contact" ? "contact" : "home";
}
export default App;
