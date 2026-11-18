import tteokwikiStudy from "./tteokwikiStudy";
import chocobowlStudy from "./chocobowlStudy";
export const caseStudies = {
  떡위키: tteokwikiStudy,
  CHOCOBOWL: chocobowlStudy,
  RAINDROP: {
    subtitle: "셰이더와 사운드로 설계한 비의 두 가지 표정",
    summary: "React로 조절 UI를 구성하고 Three.js·GLSL로 수면과 유리 위 빗방울을 렌더링한 인터랙티브 웹 작품입니다. 포인터 좌표를 장면의 좌표로 변환해 파문을 만들고, 선택한 빗방울에만 낙하 애니메이션을 적용했습니다.",
    stack: ["React", "Three.js", "GLSL", "Web Audio API"],
    goal: "사진이나 영상 대신 실시간 그래픽으로 비의 분위기를 표현하고, 관람자가 비의 세기·움직임·소리에 개입할 수 있도록 구성했습니다. SURFACE와 GLASS는 같은 컨트롤을 공유하지만 서로 다른 셰이더로 그립니다.",
    planning: [
      { title: "같은 조작으로 두 장면 비교", text: "SURFACE와 GLASS에서 강수량·소리·정지 조작을 공통으로 사용합니다. 장면을 바꾸더라도 조작 위치를 다시 찾는 과정 없이 비의 표현 차이를 비교할 수 있습니다." },
      { title: "장면마다 다른 개입 방식", text: "수면에서는 포인터 이동으로 파문을 일으키고, 유리에서는 한 방울을 선택해 떨어뜨립니다. 연속적인 움직임과 한 번의 클릭에 다른 반응을 연결해 두 장면을 체험하는 방식에 차이를 줬습니다." },
    ],
    design: [
      { title: "파문과 물방울을 읽는 시각 단서", text: "수면에서는 밝기가 바깥으로 번지는 고리로 반응의 시작점을 보여 줍니다. 유리에서는 여러 방울 사이에서 선택한 방울만 따로 가속시켜 어느 방울이 클릭에 반응했는지 움직임으로 드러냅니다." },
      { title: "강수량 변화를 화면과 소리에 함께 반영", text: "강수량 조절을 화면의 비 표현과 합성 소리의 강도에 연결했습니다. 일시정지와 소리 켜기·끄기를 따로 두어 움직임과 소리를 원하는 상태로 조절할 수 있습니다." },
    ],
    features: [
      { title: "포인터에서 시작되는 수면 파문", text: "브라우저 포인터를 -1~1 범위로 정규화한 뒤 Raycaster와 수평 평면의 교차점을 구합니다. 교차 위치와 발생 시간을 16개의 순환 슬롯에 기록하고, 셰이더에서 거리·시간·감쇠를 합산해 퍼지는 파문을 표현합니다. 포인터 이동으로 생기는 파문은 0.08초 간격으로 제한합니다." },
      { title: "누른 빗방울만 가속 낙하", text: "GLASS의 세 레이어에서 포인터 주변 셀을 탐색하고, 표시 중인 물방울 중 가장 가까운 하나를 고릅니다. CPU와 셰이더가 같은 위치 계산식을 사용하며, 선택한 물방울은 기본 레이어에서 숨기고 별도 낙하 레이어에서 그립니다. 경과 시간의 제곱 항을 더해 점점 빨라지는 움직임을 만듭니다." },
      { title: "화면과 연결되는 합성 빗소리", text: "좌우가 독립적인 핑크 노이즈 배경에 불규칙한 짧은 소리 입자를 겹칩니다. 필터로 소리의 대역을 나누고, 강수량에 따라 각 레이어의 크기와 배경 필터를 조절합니다. 실제 녹음 파일을 사용하는 방식은 아닙니다." },
    ],
    code: [
      { title: "01 / 파문의 위치와 시간을 GPU에 전달", source: "src/RainScene.jsx · ripple", language: "JavaScript", snippet: "function ripple(x, z, strength = 1) {\n  rippleData[rippleIndex % 16].set(x, -z, time, strength)\n  rippleIndex++\n}", explanation: "Vector4에는 발생 위치 2개, 발생 시간, 세기를 저장합니다. 슬롯을 재사용하므로 파문을 만들 때마다 객체나 메시를 계속 추가하지 않습니다. z의 부호를 뒤집어 수평 평면과 셰이더 좌표 방향을 맞춥니다." },
      { title: "02 / 시간이 지날수록 빨라지는 물방울", source: "src/RainScene.jsx · glassFragment 발췌", language: "GLSL", snippet: "float age = uTime - d.w;\ncenter.y -= d.w * speed / scale;\ncenter.y -= age * (speed / scale + .18)\n          + age * age * .65;", explanation: "d.w는 클릭한 시각입니다. 먼저 클릭 순간의 물방울 위치를 복원하고, 이후 경과 시간에 비례하는 이동과 제곱에 비례하는 가속 이동을 더합니다. 실제 중력 단위를 계산하는 물리 엔진이 아니라 화면 표현을 위한 근사식입니다." },
      { title: "03 / 일시정지에서 화면 전체의 시간 고정", source: "src/RainScene.jsx · tick 발췌", language: "JavaScript", snippet: "const dt = Math.min((now - last) / 1000, .04)\nlast = now\nif (!s.paused) time += dt * (reduced ? .25 : 1)\nuniforms.uTime.value = time\nglassUniforms.uTime.value = time", explanation: "두 셰이더가 같은 시간을 사용하므로 일시정지를 별도의 애니메이션마다 구현하지 않아도 됩니다. 프레임 간격을 제한해 탭 복귀 시 시간이 한 번에 크게 진행되는 현상을 완화하고, 모션 줄이기 설정에서는 진행 속도를 낮춥니다." },
    ],
    troubleshooting: [
      { type: "실제 개선", title: "단순한 잡음처럼 들리던 빗소리", problem: "초기 소리는 단일 노이즈에 가까워 실제 비의 거리감과 불규칙한 타격감을 전달하기 어려웠습니다.", solution: "스테레오 핑크 노이즈와 서로 다른 길이의 미세·근접 물방울 레이어를 만들었습니다. 소리 입자의 간격·감쇠·좌우 위치를 무작위로 분산하고 필터와 컴프레서를 적용했습니다.", result: "배경·미세 타격·근접 물방울의 질감을 나눴고, 강수량 조절이 각 레이어에 반영되도록 연결했습니다." },
      { type: "실제 오류 해결", title: "새 오디오를 켤 때 화면이 사라진 오류", problem: "GainNode의 gain은 AudioParam인데 master.gain.gain처럼 한 번 더 접근해, 소리 상태를 갱신하는 단계에서 런타임 오류가 발생했습니다.", solution: "master.gain.setTargetAtTime(...)으로 접근을 수정했습니다. 반면 레이어 객체의 gain 필드는 GainNode이므로 background.gain.gain 구조는 유지했습니다.", result: "수정 후 소리 켜기·끄기와 일시정지 상태 전환을 브라우저에서 다시 확인했습니다." },
      { type: "예방 설계", title: "상태 변경 때 렌더러가 반복 생성되는 문제 방지", problem: "강수량이나 일시정지 상태가 바뀔 때마다 WebGL 장면을 다시 만들면 자원 생성과 이벤트 등록이 반복될 수 있습니다.", solution: "최신 UI 값은 ref에 반영하고, 프레임 루프는 ref에서 값을 읽습니다. 언마운트 시 requestAnimationFrame, 이벤트, ResizeObserver, geometry·material·renderer를 정리합니다.", result: "조절 UI와 WebGL 수명 주기를 분리하고, 장면이 종료될 때 등록한 이벤트와 렌더링 자원을 해제하도록 정리했습니다." },
    ],
    limits: "수면은 높이장을 풀어내는 유체 시뮬레이션이 아니라 색·밝기를 이용한 파문 표현입니다. WebGL을 사용할 수 없는 환경에는 안내 문구를 표시합니다. 동시 낙하 물방울은 12개 슬롯을 순환 사용하며, 무제한 축적이나 실제 물방울 병합은 구현하지 않았습니다.",
  },
  FORME: {
    subtitle: "사진 없이 형태·색·움직임으로 만든 디자인 플레이그라운드",
    summary: "HTML·CSS·순수 JavaScript로 구현한 이미지 없는 인터랙티브 사이트입니다. 반대 방향으로 흐르는 포스터, 스크롤에 반응하는 장면 전환, 문구·색상 편집과 SVG 저장을 하나의 탐색 흐름으로 연결했습니다.",
    stack: ["HTML", "CSS", "Vanilla JavaScript", "SVG", "IntersectionObserver"],
    goal: "Squarespace 참고 페이지의 중앙 타이포그래피, 양방향 카드 흐름, 숫자·소개·가로 카드로 이어지는 구성을 참고했습니다. 사진 대신 독자적인 CSS 그래픽과 문구를 사용하고, 단순 감상에서 직접 포스터를 만드는 행동으로 이어지도록 구성했습니다.",
    planning: [
      { title: "감상에서 제작과 저장으로 이어지는 흐름", text: "먼저 포스터를 둘러보고, 관심이 생기면 색과 문구를 바꿔 결과를 저장하도록 흐름을 잡았습니다. 편집 결과를 브라우저에서 파일로 받을 수 있게 해 탐색이 구체적인 산출물로 이어지도록 했습니다." },
      { title: "선택 항목을 줄여 빠르게 결과 확인", text: "편집 범위를 테마와 짧은 문구로 정했습니다. 수정한 내용이 미리보기에 즉시 반영되므로 여러 조합을 비교한 뒤 마음에 드는 결과를 저장할 수 있습니다." },
    ],
    design: [
      { title: "색·형태·타이포그래피로 만든 포스터 체계", text: "사진 대신 큰 글자와 기하학적 도형, 선명한 테마 색으로 포스터를 구성했습니다. 카드마다 표정은 다르지만 글자와 도형의 대비를 공통으로 사용해 여러 장이 한 화면에 있어도 시리즈로 읽힙니다." },
      { title: "움직이는 전시에서 읽는 순간 확보", text: "두 줄의 포스터를 반대 방향으로 움직여 화면에 흐름을 만들었습니다. 카드에 마우스를 올리거나 키보드 포커스를 주면 움직임이 멈춰, 보고 싶은 작품의 제목과 그래픽을 살펴볼 수 있습니다." },
    ],
    features: [
      { title: "양방향으로 이어지는 포스터 트랙", text: "포스터 목록을 두 번 배치하고 트랙을 절반만큼 이동시켜 반복 흐름을 만듭니다. 위아래 행은 방향과 지속 시간을 다르게 설정했습니다. 마우스를 올리거나 키보드 포커스가 들어오면 움직임이 멈춥니다." },
      { title: "스크롤 위치로 연결되는 소개 장면", text: "IntersectionObserver로 설명 영역의 진입을 감지해 고정된 아트 프리뷰의 data-active와 번호를 바꿉니다. 프리뷰의 색·회전·크기는 CSS가 처리하며, 숫자 카운터는 requestAnimationFrame과 이징으로 증가합니다." },
      { title: "편집한 포스터를 SVG로 저장", text: "dialog에서 테마와 짧은 문구를 수정하면 DOM 미리보기가 즉시 갱신됩니다. 저장 시 선택한 값을 SVG 문자열로 만들고 Blob과 객체 URL로 다운로드합니다. 외부 서버나 저장 API는 사용하지 않습니다." },
    ],
    code: [
      { title: "01 / 화면에 들어온 순간 한 번만 실행", source: "script.js · IntersectionObserver 발췌, 정렬만 변경", language: "JavaScript", snippet: "if (!entry.isIntersecting) continue\nentry.target.classList.add('visible')\nconst counter = entry.target.querySelector('[data-count]')\nif (counter) animateCount(counter)\nobserver.unobserve(entry.target)", explanation: "화면 밖에서는 등장 효과와 카운터를 시작하지 않고, 첫 진입 후 관찰을 해제합니다. FORME의 소개·숫자는 일회성 재생으로 설계했으며 포트폴리오 메인의 반복형 스킬바와는 동작이 다릅니다." },
      { title: "02 / 프레임마다 중복 실행하지 않는 헤더 처리", source: "script.js · scroll 이벤트 발췌", language: "JavaScript", snippet: "if (scheduled) return\nscheduled = true\nrequestAnimationFrame(() => {\n  header.classList.toggle('scrolled', window.scrollY > 24)\n  scheduled = false\n})", explanation: "스크롤 이벤트가 연속 발생해도 다음 프레임에 처리할 작업은 한 번만 예약합니다. 헤더 높이와 경계선 변화는 scrolled 클래스에 대응하는 CSS 전환이 담당합니다." },
      { title: "03 / 편집 결과를 파일로 만드는 흐름", source: "script.js · 다운로드 로직 발췌", language: "JavaScript", snippet: "const url = URL.createObjectURL(\n  new Blob([svg], { type: 'image/svg+xml' })\n)\nconst a = document.createElement('a')\na.href = url\na.download = `forme-${currentTheme}.svg`\na.click()\nsetTimeout(() => URL.revokeObjectURL(url), 1000)", explanation: "선택한 테마와 XML 이스케이프된 문구로 SVG를 생성한 뒤 브라우저 다운로드를 시작합니다. 다운로드 후에는 객체 URL을 해제합니다. 사용자 문구의 <, >, &, 따옴표를 변환해 SVG 마크업과 섞이지 않도록 처리합니다." },
    ],
    troubleshooting: [
      { type: "실제 배포 오류 해결", title: "소스 업로드 후 Pages가 404를 반환", problem: "GitHub에 소스는 올라갔지만 Pages가 비활성화되어 configure-pages 단계가 Not Found로 실패했습니다.", solution: "저장소 Settings → Pages의 배포 소스를 GitHub Actions로 변경하고 실패한 워크플로를 다시 실행했습니다. 사이트에 필요한 index.html·style.css·script.js만 배포 아티팩트에 포함했습니다.", result: "재실행이 success로 완료되었고 공개 주소의 HTTP 200 응답과 실제 페이지 표시를 확인했습니다." },
      { type: "예방 설계", title: "움직이는 카드가 키보드 탐색을 방해하지 않도록", problem: "자동 이동하는 카드는 클릭 대상을 따라가기 어렵고, 복제한 카드까지 탭 순서에 들어가면 같은 항목을 반복 탐색하게 됩니다.", solution: "hover와 focus-within에서 애니메이션을 멈추고 복제 카드에는 tabIndex=-1과 aria-hidden을 적용했습니다. 모션 줄이기 환경에서는 자동 움직임을 끄고 수동 가로 탐색을 허용합니다.", result: "원본 포스터 중심의 키보드 탐색 경로를 마련하고, 동작을 줄이고 싶은 사용자는 자동 이동 없이 탐색할 수 있게 했습니다." },
      { type: "예방 설계", title: "사용자 입력이 SVG 구조를 깨뜨리지 않도록", problem: "입력한 문구를 SVG에 그대로 넣으면 <나 & 같은 문자가 마크업으로 해석될 수 있습니다.", solution: "텍스트 미리보기는 textContent로 갱신하고, 파일 생성에서는 escapeXml로 특수문자를 변환합니다. 입력 길이를 24자로 제한하고 비어 있으면 기본 문구를 사용합니다.", result: "HTML 삽입 대신 텍스트를 반영하고, 저장용 SVG에 문자열을 안전하게 포함하도록 구현했습니다." },
    ],
    limits: "저장 파일은 선택한 색상과 문구를 반영하는 정적인 SVG입니다. CSS 미리보기의 회전 애니메이션이나 모든 글꼴·줄바꿈을 그대로 캡처하는 기능은 아닙니다. 무한 트랙의 모바일 간격은 CSS 값과 JavaScript 보정값의 일치를 추가 점검할 여지가 있습니다.",
  },
}
