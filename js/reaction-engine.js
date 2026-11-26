(function () {
  const CV = (window.CHEMVERSE = window.CHEMVERSE || {});

  function parseSingleFormula(formula) {
    // Strip state tags like (s), (l), (aq), (g)
    const clean = formula.replace(/\((s|l|aq|g|đặc)\)/gi, '').trim();
    const stack = [{}];
    let i = 0;
    while (i < clean.length) {
      const ch = clean[i];
      if (ch === '(') {
        stack.push({});
        i++;
      } else if (ch === ')') {
        i++;
        let numStr = '';
        while (i < clean.length && /\d/.test(clean[i])) numStr += clean[i++];
        const mult = numStr ? parseInt(numStr, 10) : 1;
        const top = stack.pop();
        const parent = stack[stack.length - 1];
        for (const [el, cnt] of Object.entries(top)) {
          parent[el] = (parent[el] || 0) + cnt * mult;
        }
      } else if (/[A-Z]/.test(ch)) {
        let sym = ch;
        i++;
        while (i < clean.length && /[a-z]/.test(clean[i])) sym += clean[i++];
        let numStr = '';
        while (i < clean.length && /\d/.test(clean[i])) numStr += clean[i++];
        const cnt = numStr ? parseInt(numStr, 10) : 1;
        const cur = stack[stack.length - 1];
        cur[sym] = (cur[sym] || 0) + cnt;
      } else {
        i++;
      }
    }
    return stack[0];
  }

  function sumSideAtoms(sideStr) {
    const totals = {};
    const terms = sideStr.split('+').map((s) => s.trim()).filter(Boolean);
    for (const term of terms) {
      const m = term.match(/^(\d+)\s*(.+)$/);
      const coeff = m ? parseInt(m[1], 10) : 1;
      const formula = m ? m[2] : term;
      const atoms = parseSingleFormula(formula);
      for (const [el, cnt] of Object.entries(atoms)) {
        totals[el] = (totals[el] || 0) + cnt * coeff;
      }
    }
    return totals;
  }

  CV.ReactionEngine = {
    verifyEquationBalance(equationStr) {
      if (!equationStr || !equationStr.includes('->')) {
        return { balanced: false, leftAtoms: {}, rightAtoms: {}, summary: 'Không có phương trình chuẩn' };
      }
      const [leftStr, rightStr] = equationStr.split('->');
      const leftAtoms = sumSideAtoms(leftStr);
      const rightAtoms = sumSideAtoms(rightStr);
      const allEls = new Set([...Object.keys(leftAtoms), ...Object.keys(rightAtoms)]);
      let balanced = allEls.size > 0;
      const details = [];
      for (const el of allEls) {
        const l = leftAtoms[el] || 0;
        const r = rightAtoms[el] || 0;
        if (l !== r) balanced = false;
        details.push(`${el}: ${l}=${r}`);
      }
      return { balanced, leftAtoms, rightAtoms, summary: details.join(', ') };
    },

    findReaction(selectedIds, tempC = 25, burnerOn = false) {
      const c = new Set(selectedIds);
      const has = (x) => c.has(x);

      // 0. Safety Guardrail
      if ((has('K') || has('Na')) && (has('HCl') || has('H2SO4') || has('HNO3'))) {
        const eq = has('K') ? '2K + 2HCl -> 2KCl + H2' : '2Na + 2HCl -> 2NaCl + H2';
        return {
          status: 'danger',
          reaction: {
            title: '⚠️ CẢNH BÁO AN TOÀN THÍ NGHIỆM',
            balancedEquation: eq,
            displayEquation: has('K') ? '2K (s) + 2HCl (aq) → 2KCl (aq) + H₂ (g) ↑ [NGUY HIỂM NỔ]' : '2Na (s) + 2HCl (aq) → 2NaCl (aq) + H₂ (g) ↑ [NGUY HIỂM NỔ]',
            reactionType: 'Cơ chế bảo vệ an toàn (Safety Guardrail)',
            phenomena: { liquidColor: 'rgba(239, 68, 68, 0.38)', gas: true },
            explanation: 'Không được cho kim loại kiềm mạnh (Na, K) trực tiếp vào axit mạnh vì phản ứng tỏa nhiệt cực lớn gây bắn axit và nổ khí H₂!',
            conclusion: 'Luôn tuân thủ quy tắc an toàn: không cho kim loại kiềm vào axit mạnh.',
            atomZ: has('K') ? 19 : 11,
            ph: 1,
            balanceCheck: this.verifyEquationBalance(eq)
          }
        };
      }

      // 1. Flame Test when Burner is ON
      if (burnerOn) {
        const flameChem = (CV.CHEMICALS || []).find((ch) => ch.flame && has(ch.id));
        const hasWaterOrAcid = has('H2O') || has('HCl') || has('H2SO4') || has('HNO3');
        if (flameChem && !hasWaterOrAcid) {
          const colorNames = {
            Na: 'vàng rực (589 nm)', K: 'tím hoa cà nhạt', Li: 'đỏ tía rực rỡ',
            Cu: 'xanh lục bảo', Ba: 'vàng lục', Ca: 'đỏ cam', Mg: 'trắng chói', S: 'xanh lam mờ'
          };
          return {
            status: 'ok',
            reaction: {
              title: `Thử màu ngọn lửa: ${flameChem.name} (${flameChem.id})`,
              displayEquation: `${flameChem.id} + Δ (nhiệt) → ${flameChem.id}* → ${flameChem.id} + hν (${colorNames[flameChem.id] || 'quang phổ'})`,
              reactionType: 'Kích thích quang phổ phát xạ nguyên tử',
              phenomena: { flameColor: flameChem.flame },
              explanation: `Khi đưa mẫu ${flameChem.name} vào ngọn lửa đèn đốt, electron hấp thụ năng lượng nhảy lên mức cao rồi giải phóng photon tạo ngọn lửa màu ${colorNames[flameChem.id] || 'đặc trưng'}.`,
              conclusion: `Mỗi nguyên tố kim loại kiềm/kiềm thổ/Cu có bước sóng phát xạ quang phổ đặc trưng riêng.`,
              atomZ: flameChem.z,
              ph: 7,
              balanceCheck: { balanced: true, summary: 'Quá trình vật lý – quang phổ' }
            }
          };
        }
      }

      // 2. Match against REACTIONS database (most specific first)
      const candidates = (CV.REACTIONS || [])
        .filter((r) => r.reactants.every((req) => has(req)))
        .sort((a, b) => b.reactants.length - a.reactants.length);

      if (candidates.length > 0) {
        const rxn = candidates[0];
        if (rxn.minTemp && tempC < rxn.minTemp) {
          return {
            status: 'needs-heat',
            message: `Phản ứng (${rxn.reactants.join(' + ')}) cần đun nóng tối thiểu ${rxn.minTemp} °C. Hãy bật Đèn đốt hoặc tăng thanh nhiệt độ!`
          };
        }
        const clone = JSON.parse(JSON.stringify(rxn));
        clone.title = rxn.reactionType;
        clone.balanceCheck = this.verifyEquationBalance(rxn.balancedEquation);

        // Adjust indicator color if Phenolphtalein or Quỳ tím is also present
        if (has('Phenolphtalein') && clone.ph >= 9) {
          clone.phenomena.liquidColor = 'rgba(236, 72, 153, 0.65)';
        }
        if (has('Quỳ tím')) {
          clone.phenomena.liquidColor = clone.ph < 6 ? 'rgba(239, 68, 68, 0.65)' : clone.ph > 8 ? 'rgba(59, 130, 246, 0.68)' : 'rgba(168, 85, 247, 0.65)';
        }
        return { status: 'ok', reaction: clone };
      }

      // 3. Indicator + Single Acid or Base
      const acids = ['HCl', 'H2SO4', 'HNO3', 'CH3COOH', 'H3PO4'];
      const bases = ['NaOH', 'KOH', 'Ca(OH)2', 'Ba(OH)2', 'NH3'];
      const hasAcid = acids.some((a) => has(a));
      const hasBase = bases.some((b) => has(b));

      if (has('Phenolphtalein') && hasBase) {
        return {
          status: 'ok',
          reaction: {
            title: 'Nhận biết Bazơ bằng Phenolphtalein',
            displayEquation: 'OH⁻ (aq) + Phenolphtalein → Dung dịch màu hồng cánh sen',
            reactionType: 'Đổi màu Chất chỉ thị pH',
            phenomena: { liquidColor: 'rgba(236, 72, 153, 0.65)' },
            explanation: 'Môi trường kiềm (pH > 8.2) làm chất chỉ thị Phenolphtalein chuyển sang màu hồng cánh sen.',
            conclusion: 'Phenolphtalein là thuốc thử nhận biết dung dịch kiềm.',
            atomZ: 11,
            ph: 13,
            balanceCheck: { balanced: true, summary: 'Cân bằng chỉ thị axit-bazơ' }
          }
        };
      }
      if (has('Quỳ tím') && (hasAcid || hasBase)) {
        return {
          status: 'ok',
          reaction: {
            title: hasAcid ? 'Quỳ tím hóa Đỏ trong Axit' : 'Quỳ tím hóa Xanh trong Bazơ',
            displayEquation: hasAcid ? 'H⁺ (aq) + Quỳ tím → Đỏ' : 'OH⁻ (aq) + Quỳ tím → Xanh lam',
            reactionType: 'Đổi màu Chất chỉ thị pH',
            phenomena: { liquidColor: hasAcid ? 'rgba(239, 68, 68, 0.65)' : 'rgba(59, 130, 246, 0.68)' },
            explanation: hasAcid ? 'Ion H⁺ làm giấy/dung dịch quỳ tím chuyển sang màu đỏ.' : 'Ion OH⁻ làm dung dịch quỳ tím chuyển sang màu xanh lam.',
            conclusion: 'Quỳ tím giúp phân biệt nhanh môi trường axit (pH < 7) và bazơ (pH > 7).',
            atomZ: hasAcid ? 1 : 11,
            ph: hasAcid ? 1.5 : 13,
            balanceCheck: { balanced: true, summary: 'Cân bằng chỉ thị axit-bazơ' }
          }
        };
      }

      if (selectedIds.length >= 2) {
        return {
          status: 'no-reaction',
          message: 'Không tìm thấy phản ứng hóa học xảy ra giữa các chất đã chọn ở điều kiện hiện tại. Thử kết hợp cặp chất khác hoặc bật Đèn đốt!'
        };
      }

      return { status: 'idle', message: '' };
    },

    exportLabReport({ studentName, contents, vessel, tempC, reaction, logs }) {
      const now = new Date().toLocaleString('vi-VN');
      const eq = reaction ? reaction.displayEquation : 'Không có phản ứng';
      const bal = reaction && reaction.balanceCheck ? (reaction.balanceCheck.balanced ? `✓ Đã cân bằng (${reaction.balanceCheck.summary})` : '⚠ Chưa cân bằng') : '—';
      const html = `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><title>Báo Cáo Thí Nghiệm CHEMVERSE</title>
<style>body{font-family:system-ui,sans-serif;max-width:800px;margin:32px auto;padding:24px;line-height:1.6;color:#0f172a}h1{color:#0284c7}table{width:100%;border-collapse:collapse;margin:16px 0}td,th{border:1px solid #cbd5e1;padding:10px;text-align:left}.eq{font-family:monospace;font-size:1.1rem;background:#f1f5f9;padding:12px;border-radius:8px;color:#059669;font-weight:700}</style>
</head><body>
<h1>🧪 BÁO CÁO THÍ NGHIỆM HÓA HỌC ẢO – CHEMVERSE</h1>
<p><strong>Người thực hiện:</strong> ${studentName || 'Học sinh CHEMVERSE'} &nbsp;|&nbsp; <strong>Thời gian:</strong> ${now}</p>
<table>
  <tr><th>Dụng cụ</th><td>${vessel}</td></tr>
  <tr><th>Hóa chất sử dụng</th><td>${contents.join(', ') || 'Chưa chọn'}</td></tr>
  <tr><th>Nhiệt độ môi trường</th><td>${tempC} °C</td></tr>
  <tr><th>Loại phản ứng</th><td>${reaction ? reaction.reactionType : '—'}</td></tr>
</table>
<h3>1. Phương trình hóa học & Kiểm chứng cân bằng</h3>
<div class="eq">${eq}</div>
<p><strong>Kiểm tra bảo toàn nguyên tử:</strong> ${bal}</p>
<h3>2. Hiện tượng & Giải thích</h3>
<p>${reaction ? reaction.explanation : 'Chưa ghi nhận phản ứng.'}</p>
<h3>3. Kết luận</h3>
<p>${reaction ? (reaction.conclusion || reaction.explanation) : '—'}</p>
<h3>4. Nhật ký thao tác</h3>
<ul>${(logs || []).map((l) => `<li>${l}</li>`).join('')}</ul>
</body></html>`;

      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chemverse-lab-report-${Date.now()}.html`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };
})();
