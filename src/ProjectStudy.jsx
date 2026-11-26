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
      <section className="study-section" aria-labelledby="study-design">
        <h3 id="study-design">01 / 디자인</h3>
        {study.design.map(({ title, text }) => (
          <article className="study-item" key={title}>
            <h4>{title}</h4>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="study-section" aria-labelledby="study-planning">
        <h3 id="study-planning">02 / 기획</h3>
        <p>{study.goal}</p>
        {study.planning.map(({ title, text }) => (
          <article className="study-item" key={title}>
            <h4>{title}</h4>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="study-section" aria-labelledby="study-programming">
        <h3 id="study-programming">03 / 프로그래밍</h3>

        <div className="study-topic">
          <h4>AI 활용과 결과물 개선</h4>
          <p>{study.aiIteration}</p>
        </div>

        <div className="study-topic">
          <h4>핵심 기능</h4>
          {study.features.map(({ title, text }) => (
            <article className="study-item" key={title}>
              <h5>{title}</h5>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className="study-topic">
          <h4>주요 코드와 동작 원리</h4>
          {study.code.map(({ title, source, language, snippet, explanation }) => (
            <article className="study-item" key={title}>
              <h5>{title}</h5>
              <span className="study-source">{source} · {language}</span>
              <pre><code>{snippet}</code></pre>
              <p>{explanation}</p>
            </article>
          ))}
        </div>

        <div className="study-topic">
          <h4>트러블슈팅과 예방 설계</h4>
          {study.troubleshooting.map(({ type, title, problem, solution, result }) => (
            <article className="study-trouble" key={title}>
              <span className="study-badge">{type}</span>
              <h5>{title}</h5>
              <dl>
                <dt>문제</dt><dd>{problem}</dd>
                <dt>해결</dt><dd>{solution}</dd>
                <dt>결과</dt><dd>{result}</dd>
              </dl>
            </article>
          ))}
        </div>

        <div className="study-topic">
          <h4>구현 범위와 다음 과제</h4>
          <p>{study.limits}</p>
        </div>
      </section>
      <div className="study-end"><button type="button" className="study-back" onClick={onClose}>프로젝트 목록으로 돌아가기</button></div>
    </div>
  </dialog>;
}
