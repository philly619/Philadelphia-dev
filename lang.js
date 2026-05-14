// ── TABLE SEARCH FILTER ──
function filterTable(query) {
  const q = query.toLowerCase();
  const rows = document.querySelectorAll('#customer-table tbody tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(q) ? '' : 'none';
  });
}

// ── SCROLL-TRIGGERED ROW ANIMATIONS ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.animation = `fadeUp 0.5s ${i * 0.04}s ease both`;
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('tbody tr').forEach(row => observer.observe(row));
