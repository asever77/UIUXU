document.addEventListener('DOMContentLoaded', () => {
  // 1. 차트 기본 설정
  const width = 500; // 차트 영역 너비
  const height = 500; // 차트 영역 높이
  const padding = 5; // 원형 간 최소 간격 (반지름에 추가)
  const minRadius = 15; // 원형 최소 반지름
  const maxRadius = 60; // 원형 최대 반지름

  // 2. 데이터 준비 (10개의 원형)
  const bubbleData = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    percentage: Math.floor(Math.random() * 90) + 10, // 10% ~ 100% 랜덤 값
    name: `아이템 ${i + 1}`
  }));

  // 3. SVG 컨테이너 설정
  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart-container");

  // 4. 스케일 함수: 퍼센트를 반지름으로 매핑
  const radiusScale = d3.scaleSqrt() // 제곱근 스케일 사용 (크기 인지 왜곡 보정)
    .domain([d3.min(bubbleData, d => d.percentage), d3.max(bubbleData, d => d.percentage)])
    .range([minRadius, maxRadius]);

  // 5. D3 Force 시뮬레이션 설정
  // 원형들이 서로 겹치지 않고 특정 영역 내에 고르게 분포되도록 함
  const simulation = d3.forceSimulation(bubbleData)
    .force("charge", d3.forceManyBody().strength(30)) // 서로 밀어내는 힘 (클수록 강하게 밀어냄)
    .force("collide", d3.forceCollide().radius(d => radiusScale(d.percentage) + padding)) // 원형 충돌 방지 (반지름 + 여백)
    .force("x", d3.forceX(width / 2).strength(0.05)) // X축 중앙으로 모으는 힘 (약하게 적용하여 랜덤성 유지)
    .force("y", d3.forceY(height / 2).strength(0.05)) // Y축 중앙으로 모으는 힘
    .on("tick", ticked); // 시뮬레이션 각 스텝마다 호출될 함수

  // 6. 툴팁 요소 선택
  const tooltip = d3.select("#tooltip");

  // 7. 원형 (Circle) 요소 생성
  const bubbles = svg.selectAll(".bubble2")
    .data(bubbleData)
    .enter()
    .append("circle")
    .attr("class", "bubble2")
    .attr("r", d => radiusScale(d.percentage))
    .attr("fill", d => `hsl(${d.percentage * 2.5}, 70%, 50%)`) // 퍼센트에 따라 색상 변경 (HLS: Hue, Lightness, Saturation)
    .on("click", handleClick)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  // 8. 원형 내부 텍스트 (Label) 요소 생성
  const labels = svg.selectAll(".bubble-label")
    .data(bubbleData)
    .enter()
    .append("text")
    .attr("class", "bubble-label")
    .text(d => `${d.percentage}%`);

  // 9. 시뮬레이션 'tick' 이벤트 핸들러
  // 각 원형의 위치가 업데이트될 때마다 SVG 요소의 위치를 동기화
  function ticked() {
    bubbles
      .attr("cx", d => Math.max(radiusScale(d.percentage), Math.min(width - radiusScale(d.percentage), d.x)))
      .attr("cy", d => Math.max(radiusScale(d.percentage), Math.min(height - radiusScale(d.percentage), d.y)));

    labels
      .attr("x", d => Math.max(radiusScale(d.percentage), Math.min(width - radiusScale(d.percentage), d.x)))
      .attr("y", d => Math.max(radiusScale(d.percentage), Math.min(height - radiusScale(d.percentage), d.y)) + 4); // 텍스트 중앙 정렬을 위해 살짝 아래로 조정
  }

  // 10. 클릭 이벤트 핸들러
  function handleClick(event, d) {
    console.log("클릭된 버블:", d);
    alert(`"${d.name}" (${d.percentage}%)이(가) 클릭되었습니다!`);
    // 여기에 클릭 시 실행할 추가 로직을 구현하세요 (예: 상세 정보 표시)
  }

  // 11. 마우스 오버 이벤트 핸들러 (툴팁 표시)
  function handleMouseOver(event, d) {
    tooltip.style("opacity", 1)
      .html(`<strong>${d.name}</strong><br>퍼센트: ${d.percentage}%`)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px");

    // 마우스 오버된 원형 강조 (선택 사항)
    d3.select(this)
      .transition()
      .duration(100)
      .attr("stroke-width", 3)
      .attr("stroke", "orange");
  }

  // 12. 마우스 아웃 이벤트 핸들러 (툴팁 숨기기)
  function handleMouseOut(event, d) {
    tooltip.style("opacity", 0);

    // 강조 해제
    d3.select(this)
      .transition()
      .duration(100)
      .attr("stroke-width", 1)
      .attr("stroke", "#333");
  }

  // 시뮬레이션 시작
  simulation.alphaTarget(0.3).restart(); // 시뮬레이션이 천천히 시작하여 안정화되도록 설정
});