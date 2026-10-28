import { useEffect, useRef } from "react";
import { caseStudies } from "./caseStudies";

export default function ProjectStudy({ project, onClose }) {
  const ref = useRef(null);
  const triggerRef = useRef(null);
  const study = caseStudies[project.title];
  useEffect(() => {
    const dialog = ref.current;
    if (!triggerRef.current) triggerRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {

      document.body.style.overflow = previousOverflow;
      requestAnimationFrame(() => {
        if (!dialog.isConnected && triggerRef.current?.isConnected) triggerRef.current.focus({ preventScroll: true });
      });
    };
  }, []);
  return <dialog className="project-study" ref={ref} onClose={onClose} aria-labelledby="study-title" onClick={event => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
  }}>
    <div className="study-bar"><span>PROJECT / {project.number}</span><button type="button" onClick={onClose} autoFocus aria-label="구현 과정 닫기">CLOSE ×</button></div>
    <div className="study-content">
      <header className="study-heading"><span className="study-kicker">INTERACTION CASE STUDY</span><h2 id="study-title">{project.title}</h2><p className="study-subtitle">{study.subtitle}</p><p>{study.summary}</p><div className="study-tags">{study.stack.map(tag => <span key={tag}>{tag}</span>)}</div>{project.url ? <a className="project-visit" href={project.url} target="_blank" rel="noopener noreferrer">사이트 바로가기 ↗</a> : <span className="project-link-pending">사이트 링크 준비 중</span>}</header>
      <section className="study-section"><h3>01 / 기획 의도</h3><p>{study.goal}</p></section>
      <section className="study-section"><h3>02 / 핵심 인터랙션</h3>{study.features.map(item => <article className="study-item" key={item.title}><h4>{item.title}</h4><p>{item.text}</p></article>)}</section>
      <section className="study-section"><h3>03 / 중요 코드와 동작 원리</h3><p className="study-note">실제 프로젝트 코드의 발췌입니다. 읽기 쉽게 줄바꿈과 간격을 정리했습니다.</p>{study.code.map(item => <article className="study-item" key={item.title}><h4>{item.title}</h4><span className="study-source">{item.source} · {item.language}</span><pre><code>{item.snippet}</code></pre><p>{item.explanation}</p></article>)}</section>
      <section className="study-section"><h3>04 / 트러블슈팅과 예방 설계</h3><p className="study-note">실제로 발생한 오류·개선과, 코드에 반영한 예방 설계를 구분했습니다.</p>{study.troubleshooting.map(item => <article className="study-trouble" key={item.title}><span className="study-badge">{item.type}</span><h4>{item.title}</h4><dl><dt>문제</dt><dd>{item.problem}</dd><dt>해결</dt><dd>{item.solution}</dd><dt>결과</dt><dd>{item.result}</dd></dl></article>)}</section>
      <section className="study-section"><h3>05 / 구현 범위와 다음 과제</h3><p>{study.limits}</p></section>
      <div className="study-end"><button type="button" className="study-back" onClick={onClose}>프로젝트 목록으로 돌아가기</button></div>
    </div>
  </dialog>;
}
