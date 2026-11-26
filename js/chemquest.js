(function () {
  const CV = window.CHEMVERSE;

  const COMPOUNDS = [
    { formula: 'H₂O', name: 'Nước tinh khiết', req: { H: 2, O: 1 }, fact: 'Phân tử phân cực tạo nên sự sống trên Trái Đất.' },
    { formula: 'NaCl', name: 'Muối ăn (Natri Clorua)', req: { Na: 1, Cl: 1 }, fact: 'Hợp chất ion điển hình giữa kim loại kiềm và halogen.' },
    { formula: 'CO₂', name: 'Cacbon đioxit', req: { C: 1, O: 2 }, fact: 'Khí nhà kính quan trọng và là nguyên liệu cho quang hợp.' },
    { formula: 'NH₃', name: 'Amoniac', req: { N: 1, H: 3 }, fact: 'Nguyên liệu cốt lõi để sản xuất phân bón đạm.' },
    { formula: 'CH₄', name: 'Khí Metan', req: { C: 1, H: 4 }, fact: 'Thành phần chính của khí thiên nhiên.' },
    { formula: 'H₂SO₄', name: 'Axit Sunfuric', req: { H: 2, S: 1, O: 4 }, fact: 'Hóa chất công nghiệp quan trọng bậc nhất thế giới.' },
    { formula: 'CaCO₃', name: 'Đá vôi (Canxi cacbonat)', req: { Ca: 1, C: 1, O: 3 }, fact: 'Thành phần chính của đá vôi, đá cẩm thạch và vỏ sò.' },
    { formula: 'C₂H₅OH', name: 'Ancol Etylic (Etanol)', req: { C: 2, H: 6, O: 1 }, fact: 'Ancol phổ biến dùng trong y tế, nhiên liệu sinh học và công nghiệp.' }
  ];

  const QUIZ_BANK = {
    basic: [
      { q: 'Nguyên tố nào nhẹ nhất và phổ biến nhất trong vũ trụ?', opts: ['Heli (He)', 'Hydro (H)', 'Oxy (O)', 'Cacbon (C)'], ans: 1, exp: 'Hydro (Z=1) chiếm khoảng 75% khối lượng vật chất thông thường trong vũ trụ.' },
      { q: 'Kim loại nào tồn tại ở trạng thái lỏng ở nhiệt độ phòng (25°C)?', opts: ['Gali (Ga)', 'Thủy ngân (Hg)', 'Xesi (Cs)', 'Chì (Pb)'], ans: 1, exp: 'Thủy ngân nóng chảy ở 234.32 K (-38.8°C) nên ở thể lỏng tại 25°C.' },
      { q: 'Khí nào chiếm khoảng 78% thể tích khí quyển Trái Đất?', opts: ['Oxy', 'Argon', 'Nitơ', 'Cacbon đioxit'], ans: 2, exp: 'Nitơ (N₂) chiếm ~78% khí quyển, Oxy chiếm ~21%.' },
      { q: 'Ký hiệu hóa học của nguyên tố Sắt là gì?', opts: ['Ir', 'Fe', 'Si', 'Au'], ans: 1, exp: 'Fe xuất phát từ tên Latinh "Ferrum".' },
      { q: 'Nguyên tố nào là nền tảng của mọi hợp chất hữu cơ và sự sống?', opts: ['Silic', 'Cacbon', 'Photpho', 'Lưu huỳnh'], ans: 1, exp: 'Cacbon có 4 electron hóa trị, dễ dàng tạo mạch dài và vòng bền vững.' },
      { q: 'Nhóm các nguyên tố nào hầu như trơ về mặt hóa học ở điều kiện thường?', opts: ['Halogen', 'Kim loại kiềm', 'Khí hiếm', 'Á kim'], ans: 2, exp: 'Khí hiếm (Nhóm 18) có lớp vỏ electron ngoài cùng đã bão hòa bền vững.' },
      { q: 'Kim loại nào dẫn điện tốt nhất trong tất cả các nguyên tố?', opts: ['Đồng (Cu)', 'Vàng (Au)', 'Bạc (Ag)', 'Nhôm (Al)'], ans: 2, exp: 'Bạc (Ag) có độ dẫn điện cao nhất, tiếp theo là Đồng (Cu) và Vàng (Au).' },
      { q: 'Phi kim duy nhất ở trạng thái lỏng tại 25°C là nguyên tố nào?', opts: ['Flo (F)', 'Clo (Cl)', 'Brom (Br)', 'Iot (I)'], ans: 2, exp: 'Brom (Br) là chất lỏng màu nâu đỏ dễ bay hơi ở nhiệt độ phòng.' },
      { q: 'Hạt mang điện tích dương trong hạt nhân nguyên tử là gì?', opts: ['Electron', 'Proton', 'Neutron', 'Photon'], ans: 1, exp: 'Proton mang điện tích +1, quy định số hiệu nguyên tử Z.' },
      { q: 'Nguyên tố nào tạo nên màu đỏ của máu qua phân tử Hemoglobin?', opts: ['Đồng (Cu)', 'Kẽm (Zn)', 'Sắt (Fe)', 'Magie (Mg)'], ans: 2, exp: 'Ion Sắt ở trung tâm nhóm heme giúp vận chuyển oxy trong hồng cầu.' },
      { q: 'Khi nhỏ Phenolphtalein vào dung dịch bazơ NaOH, dung dịch chuyển màu gì?', opts: ['Xanh lam', 'Hồng cánh sen', 'Vàng cam', 'Không màu'], ans: 1, exp: 'Phenolphtalein chuyển màu hồng cánh sen trong môi trường kiềm (pH > 8.2).' },
      { q: 'Muối ăn hằng ngày có công thức hóa học là gì?', opts: ['KCl', 'NaCl', 'CaCl₂', 'NaOH'], ans: 1, exp: 'Natri clorua (NaCl) là thành phần chính của muối ăn.' },
      { q: 'Kim loại nào nhẹ nhất trong bảng tuần hoàn?', opts: ['Natri (Na)', 'Nhôm (Al)', 'Liti (Li)', 'Magie (Mg)'], ans: 2, exp: 'Liti (Z=3) có khối lượng riêng chỉ 0.534 g/cm³, nổi trên mặt nước.' },
      { q: 'Khí nào làm đục nước vôi trong Ca(OH)₂?', opts: ['O₂', 'H₂', 'CO₂', 'N₂'], ans: 2, exp: 'CO₂ + Ca(OH)₂ → CaCO₃↓ (trắng) + H₂O.' },
      { q: 'Nguyên tố phổ biến nhất trong lớp vỏ Trái Đất là?', opts: ['Silic (Si)', 'Sắt (Fe)', 'Oxy (O)', 'Nhôm (Al)'], ans: 2, exp: 'Oxy chiếm khoảng 46.1% khối lượng lớp vỏ Trái Đất dưới dạng oxit và silicat.' },
      { q: 'Đốt muối Natri (Na) trên ngọn lửa cho màu quang phổ gì?', opts: ['Tím hoa cà', 'Vàng rực', 'Xanh lục', 'Đỏ cam'], ans: 1, exp: 'Natri phát xạ vạch kép D màu vàng rực đặc trưng ở 589 nm.' },
      { q: 'Số hiệu nguyên tử (Z) của nguyên tố Oxy (O) là bao nhiêu?', opts: ['6', '7', '8', '16'], ans: 2, exp: 'Oxy có 8 proton trong hạt nhân nên Z = 8.' },
      { q: 'Chất nào được dùng làm thuốc thử nhận biết Hồ tinh bột (tạo màu xanh tím)?', opts: ['Dung dịch Brom', 'Dung dịch Iot (I₂)', 'Axit HCl', 'NaOH'], ans: 1, exp: 'Iot len vào cấu trúc xoắn của amilozơ trong hồ tinh bột tạo phức xanh tím.' },
      { q: 'Khi cho Kẽm (Zn) vào dung dịch HCl, khí nào thoát ra?', opts: ['Cl₂', 'O₂', 'H₂', 'CO₂'], ans: 2, exp: 'Zn + 2HCl → ZnCl₂ + H₂↑.' },
      { q: 'Trong bảng tuần hoàn hiện đại, các nguyên tố được sắp xếp theo chiều tăng dần của?', opts: ['Nguyên tử khối', 'Số neutron', 'Điện tích hạt nhân (Z)', 'Độ âm điện'], ans: 2, exp: 'Định luật tuần hoàn hiện đại sắp xếp theo chiều tăng của số hiệu nguyên tử Z.' }
    ],
    advanced: [
      { q: 'Nguyên tố có độ âm điện lớn nhất trên thang Pauling (3.98) là?', opts: ['Oxy (O)', 'Clo (Cl)', 'Flo (F)', 'Neon (Ne)'], ans: 2, exp: 'Flo (Z=9) có bán kính nhỏ và lực hút electron mạnh nhất.' },
      { q: 'Kim loại nào có điểm nóng chảy cao nhất (3695 K)?', opts: ['Titan (Ti)', 'Vonfram (W)', 'Osmi (Os)', 'Sắt (Fe)'], ans: 1, exp: 'Vonfram (Tungsten) nóng chảy ở 3695 K (3422°C), dùng làm dây tóc bóng đèn.' },
      { q: 'Đồng vị phóng xạ nào cung cấp điện cho tàu vũ trụ Voyager & xe tự hành Sao Hỏa?', opts: ['Urani-235', 'Plutoni-238', 'Thori-232', 'Cacbon-14'], ans: 1, exp: 'Pu-238 tỏa nhiệt phân rã alpha ổn định cho máy phát RTG.' },
      { q: 'Nguyên tố nào có khối lượng riêng lớn nhất trong tự nhiên (22.59 g/cm³)?', opts: ['Vàng (Au)', 'Bạch kim (Pt)', 'Osmi (Os)', 'Chì (Pb)'], ans: 2, exp: 'Osmi (Z=76) là kim loại tự nhiên đặc nhất.' },
      { q: 'Cấu hình electron của Đồng (Cu, Z=29) ở trạng thái cơ bản kết thúc là?', opts: ['[Ar] 3d⁹ 4s²', '[Ar] 3d¹⁰ 4s¹', '[Ar] 3d⁸ 4s²', '[Ar] 4s² 4p⁶'], ans: 1, exp: 'Cu có sự chuyển 1e từ 4s sang 3d để đạt phân lớp 3d¹⁰ bão hòa bền vững.' },
      { q: 'Nguyên tố đầu tiên được phát hiện tại châu Á (Nhật Bản) là?', opts: ['Moscovium', 'Nihonium (Nh)', 'Flerovium', 'Tennessine'], ans: 1, exp: 'Nihonium (Z=113) được tổng hợp tại viện RIKEN (Nhật Bản).' },
      { q: 'Nguyên tố nào là trung tâm của phân tử Diệp lục (Chlorophyll)?', opts: ['Canxi (Ca)', 'Magie (Mg)', 'Sắt (Fe)', 'Kali (K)'], ans: 1, exp: 'Ion Mg²⁺ nằm ở trung tâm vòng porphyrin của diệp lục.' },
      { q: 'Trong mạng cáp quang biển, ion đất hiếm nào khuếch đại tín hiệu ánh sáng?', opts: ['Neodymi (Nd)', 'Erbi (Er)', 'Xeri (Ce)', 'Lantan (La)'], ans: 1, exp: 'Bộ khuếch đại EDFA sử dụng sợi quang pha Erbi (Er³⁺).' },
      { q: 'Nguyên tố tự nhiên hiếm nhất trên vỏ Trái Đất (chưa tới 30 gam) là?', opts: ['Franxi (Fr)', 'Astatin (At)', 'Prometi (Pm)', 'Radi (Ra)'], ans: 1, exp: 'Astatin (Z=85) cực kỳ phóng xạ và có chu kỳ bán rã rất ngắn.' },
      { q: 'Nguyên tố nào dùng để định nghĩa đơn vị giây chuẩn trong đồng hồ nguyên tử?', opts: ['Rubidi (Rb)', 'Xesi (Cs)', 'Stronti (Sr)', 'Thủy ngân (Hg)'], ans: 1, exp: 'Tần số chuyển mức siêu tinh tế của nguyên tử Cs-133 định nghĩa 1 giây.' },
      { q: 'Phân lớp d có tối đa bao nhiêu ô orbital lượng tử và bao nhiêu electron?', opts: ['3 ô – 6e', '5 ô – 10e', '7 ô – 14e', '1 ô – 2e'], ans: 1, exp: 'Với l=2 (phân lớp d), m nhận 5 giá trị (-2,-1,0,+1,+2) → 5 ô orbital, tối đa 10e.' },
      { q: 'Nguyên tử Nitơ (Z=7) ở trạng thái cơ bản có bao nhiêu electron độc thân?', opts: ['1', '2', '3', '5'], ans: 2, exp: 'Theo quy tắc Hund, phân lớp 2p³ của Nitơ điền vào 3 ô orbital khác nhau → 3e độc thân.' },
      { q: 'Hiệu độ âm điện Δχ ≥ 1.7 giữa hai nguyên tử thường tạo thành loại liên kết nào?', opts: ['Cộng hóa trị không cực', 'Liên kết Ion', 'Liên kết Hydro', 'Liên kết Kim loại'], ans: 1, exp: 'Chênh lệch độ âm điện lớn (Δχ ≥ 1.7) dẫn đến sự chuyển hẳn electron tạo liên kết Ion.' },
      { q: 'Kết tủa màu vàng óng ánh "Cơn mưa vàng" tạo thành khi trộn Pb(NO₃)₂ với KI là chất nào?', opts: ['Pb(NO₃)₂', 'KNO₃', 'PbI₂', 'K₂I'], ans: 2, exp: 'Pb(NO₃)₂ + 2KI → PbI₂↓ (vàng rực) + 2KNO₃.' },
      { q: 'Dung dịch phức chất màu đỏ máu thu được khi cho KSCN tác dụng với FeCl₃ là?', opts: ['Fe(OH)₃', 'Fe(SCN)₃', 'K₃[Fe(CN)₆]', 'Fe₂O₃'], ans: 1, exp: 'Ion Fe³⁺ tạo phức chất [Fe(SCN)]²⁺ / Fe(SCN)₃ có màu đỏ máu rất nhạy.' },
      { q: 'Mức năng lượng của electron ở lớp n = 2 trong nguyên tử Hydro (Eₙ = -13.6/n²) là?', opts: ['-13.6 eV', '-3.40 eV', '-1.51 eV', '-0.85 eV'], ans: 1, exp: 'Với n = 2: E₂ = -13.6 / 2² = -3.40 eV.' },
      { q: 'Khi cho Sắt (Fe) vào dung dịch CuSO₄, hiện tượng quan sát được là gì?', opts: ['Sủi bọt khí H₂', 'Kết tủa trắng', 'Đồng đỏ bám ngoài đinh sắt', 'Không phản ứng'], ans: 2, exp: 'Fe + CuSO₄ → FeSO₄ + Cu↓ (Sắt đẩy Đồng ra khỏi muối).' },
      { q: 'Nhiệt phân Cu(OH)₂ (xanh lam) ở nhiệt độ cao thu được chất rắn nào?', opts: ['Cu (đỏ)', 'CuO (đen)', 'Cu₂O (đỏ gạch)', 'CuSO₄'], ans: 1, exp: 'Cu(OH)₂ —(t°)→ CuO (màu đen) + H₂O.' },
      { q: 'Trong một chu kỳ từ trái sang phải, bán kính nguyên tử nhìn chung biến đổi như thế nào?', opts: ['Tăng dần', 'Giảm dần', 'Không đổi', 'Tăng rồi giảm'], ans: 1, exp: 'Điện tích hạt nhân tăng trong khi số lớp e không đổi nên lực hút vỏ mạnh hơn → bán kính giảm.' },
      { q: 'Nguyên tố nặng nhất được IUPAC công nhận (Z = 118) hiện nay là?', opts: ['Tennessine (Ts)', 'Livermorium (Lv)', 'Oganesson (Og)', 'Flerovium (Fl)'], ans: 2, exp: 'Oganesson (Og, Z=118) hoàn thiện chu kỳ 7 của bảng tuần hoàn.' }
    ]
  };

  const DAILY_PRACTICE_BANK = [
    {
      id: 'rust',
      type: 'situation',
      topic: 'Gỉ sét đồ sắt',
      title: '🚲 Tại sao xe đạp để ngoài mưa lâu ngày bị gỉ sét?',
      prompt: 'Xích và khung xe đạp bằng sắt (Fe) để ngoài trời ẩm ướt xuất hiện lớp gỉ màu nâu đỏ. Nguyên nhân hóa học chính là gì và phòng chống thế nào?',
      opts: [
        'Sắt tác dụng với O₂ và hơi nước tạo oxit sắt ngậm nước (Fe₂O₃·nH₂O); phòng bằng sơn phủ, tra dầu mỡ.',
        'Sắt tự phân hủy dưới ánh nắng mặt trời; phòng bằng cách rửa nước muối.',
        'Sắt phản ứng với khí Nitơ (N₂) trong không khí; phòng bằng cách phơi nắng.',
        'Sắt bay hơi dần thành bụi đỏ; phòng bằng cách bọc giấy báo.'
      ],
      ans: 0,
      hint: 'Hãy nhớ lại điều kiện để kim loại Sắt bị ăn mòn điện hóa / hóa học trong không khí ẩm: cần đồng thời khí nào và chất lỏng nào?',
      solution: 'Trong không khí ẩm, Sắt (Fe) bị oxi hóa chậm bởi khí Oxy (O₂) và hơi nước (H₂O) tạo lớp gỉ xốp Fe₂O₃·nH₂O màu nâu đỏ. Để bảo vệ đồ sắt, ta ngăn không cho Fe tiếp xúc với O₂ và H₂O bằng cách sơn chống gỉ, mạ kẽm hoặc tra dầu nhớt.'
    },
    {
      id: 'fish-odor',
      type: 'situation',
      topic: 'Khử mùi tanh cá',
      title: '🐟 Mẹo vắt chanh hoặc dùng giấm khử mùi tanh cá',
      prompt: 'Khi sơ chế cá, người ta thường xát chanh hoặc giấm ăn để hết mùi tanh. Cơ sở hóa học của mẹo nhà bếp này là gì?',
      opts: [
        'Chanh và giấm có vị ngọt giúp át mùi cá.',
        'Axit hữu cơ (axit citric, axit axetic) phản ứng trung hòa các amin có tính bazơ gây mùi tanh.',
        'Axit làm đông tụ toàn bộ nước trong thịt cá.',
        'Chanh tạo kết tủa bạc trắng trên da cá.'
      ],
      ans: 1,
      hint: 'Mùi tanh của cá chủ yếu do các hợp chất hữu cơ chứa Nitơ (amin như trimetylamin) có tính bazơ yếu gây ra. Chanh/giấm có tính gì?',
      solution: 'Chất gây mùi tanh của cá là các amin (có tính bazơ nhẹ). Nước cốt chanh (axit citric) và giấm ăn (CH₃COOH) có tính axit nên trung hòa amin thành muối không bay hơi, giúp khử sạch mùi tanh tự nhiên.'
    },
    {
      id: 'soda-fizz',
      type: 'situation',
      topic: 'Nước giải khát có gas',
      title: '🥤 Hiện tượng sủi bọt khi mở nắp chai nước ngọt có gas',
      prompt: 'Tại sao khi bật nắp chai nước ngọt có gas (Coca, Pepsi, soda), bọt khí lập tức sủi lên mạnh mẽ?',
      opts: [
        'Do đường trong nước ngọt tác dụng với không khí tạo khí O₂.',
        'Áp suất giảm đột ngột làm axit yếu H₂CO₃ phân hủy giải phóng khí CO₂↑.',
        'Vỏ chai nhựa sinh ra bọt khí khi tiếp xúc ánh sáng.',
        'Nước ngọt sôi ở nhiệt độ phòng.'
      ],
      ans: 1,
      hint: 'Khí được nén vào nước ngọt dưới áp suất cao là CO₂, hòa tan tạo cân bằng H₂O + CO₂ ⇌ H₂CO₃. Khi mở nắp, áp suất thay đổi thế nào?',
      solution: 'Trong chai đóng kín ở áp suất cao, khí CO₂ tan nhiều tạo axit cacbonic (H₂CO₃). Khi mở nắp, áp suất giảm đột ngột khiến cân bằng chuyển dịch, H₂CO₃ phân hủy nhanh thành H₂O và khí CO₂↑ thoát ra tạo bọt sủi mát lạnh.'
    },
    {
      id: 'fire-safety',
      type: 'situation',
      topic: 'Dập tắt đám cháy an toàn',
      title: '🔥 Xử lý khi chảo dầu ăn hoặc xăng bị bén lửa nhỏ',
      prompt: 'Nếu chảo dầu ăn trên bếp không may bùng lửa nhỏ, cách xử lý nào AN TOÀN và đúng hóa học nhất?',
      opts: [
        'Dội ngay một ca nước lạnh vào chảo dầu đang cháy.',
        'Tắt bếp, đậy kín nắp chảo hoặc phủ khăn ẩm/dùng bình khí CO₂ để cách ly khí O₂.',
        'Thổi mạnh bằng miệng cho lửa tắt.',
        'Đổ thêm cồn vào để dập lửa.'
      ],
      ans: 1,
      hint: 'Dầu ăn nhẹ hơn nước và không tan trong nước; nếu dội nước, nước sôi bốc hơi kéo theo dầu bắn tung tóe. Để dập cháy cần cắt nguồn gì?',
      solution: 'Sự cháy cần 3 yếu tố: chất cháy, nhiệt độ và khí Oxy (O₂). Tuyệt đối KHÔNG dùng nước cho cháy dầu/xăng vì dầu nổi trên nước sẽ làm đám cháy lan rộng. Đậy kín nắp chảo hoặc dùng bình CO₂/cát sẽ ngăn nguồn O₂ và dập tắt lửa an toàn.'
    },
    {
      id: 'toothpaste',
      type: 'situation',
      topic: 'Kem đánh răng',
      title: '🪥 Tác dụng bảo vệ men răng của kem đánh răng',
      prompt: 'Kem đánh răng thường bổ sung Natri florua (NaF) và chất mài mịn CaCO₃ cùng tính kiềm nhẹ. Vai trò chính của chúng là gì?',
      opts: [
        'Tăng lượng axit trong miệng để tiêu hóa thức ăn nhanh hơn.',
        'Trung hòa axit do vi khuẩn tạo ra và ion F⁻ giúp tái khoáng hóa men răng bền vững hơn.',
        'Tạo lớp kim loại bạc phủ lên bề mặt răng.',
        'Làm răng nóng lên để diệt khuẩn.'
      ],
      ans: 1,
      hint: 'Vi khuẩn lên men đường dư tạo axit ăn mòn men răng. Kem đánh răng có pH hơi kiềm và chứa ion Florua (F⁻) giúp làm gì?',
      solution: 'Sau khi ăn, vi khuẩn chuyển đường thành axit làm mòn men răng. Kem đánh răng có tính kiềm nhẹ giúp trung hòa axit, còn ion F⁻ từ NaF thay thế nhóm OH⁻ trong men răng tạo fluorapatit cứng chắc và chống sâu răng.'
    },
    {
      id: 'daily-match-1',
      type: 'match',
      topic: 'Ghép đôi hiện tượng đời sống',
      title: '🔗 Ghép hiện tượng hằng ngày với nguyên nhân hóa học',
      prompt: 'Kéo thả (hoặc bấm chọn từng cặp) để nối đúng 4 hiện tượng thực tế với chất/phương trình hóa học tương ứng:',
      pairs: [
        { left: 'Vôi sống gặp nước tỏa nhiệt mạnh', right: 'CaO + H₂O → Ca(OH)₂' },
        { left: 'Mưa axit ăn mòn tượng đá vôi', right: 'SO₂, NO₂ tạo H₂SO₄, HNO₃' },
        { left: 'Ướp muối bảo quản thịt cá lâu hỏng', right: 'NaCl hút ẩm ức chế vi khuẩn' },
        { left: 'Bón phân đạm giúp lá cây xanh tốt', right: 'NH₄NO₃ / Urê cung cấp Nitơ' }
      ],
      hint: 'Chú ý từ khóa: Vôi sống là CaO; mưa axit do khí thải công nghiệp chứa S, N; muối ăn là NaCl; phân đạm giàu nguyên tố N.',
      solution: '1) Vôi sống CaO + H₂O → Ca(OH)₂ tỏa nhiệt lớn. 2) Khí SO₂, NO₂ gặp nước mưa tạo mưa axit H₂SO₄, HNO₃ ăn mòn đá vôi CaCO₃. 3) Muối ăn NaCl tạo áp suất thẩm thấu cao làm vi khuẩn mất nước. 4) Phân đạm cung cấp Nitơ tổng hợp diệp lục.'
    },
    {
      id: 'lime-fill',
      type: 'fill',
      topic: 'Vôi tôi tỏa nhiệt',
      title: '🧱 Hoàn thành phương trình tôi vôi trong xây dựng',
      prompt: 'Khi cho vôi sống (CaO) vào nước sẽ sôi sục và tỏa nhiệt rất mạnh tạo vôi tôi. Điền công thức sản phẩm còn thiếu:  CaO + H₂O → ______',
      accepted: ['Ca(OH)2', 'ca(oh)2', 'Ca(OH)₂'],
      quickChoices: ['Ca(OH)₂', 'CaCO₃', 'CaCl₂', 'CaO₂'],
      hint: 'Oxit bazơ CaO tác dụng với nước (H₂O) tạo thành dung dịch bazơ (kiềm) tương ứng của Canxi hóa trị II.',
      solution: 'Phương trình hoàn chỉnh: CaO + H₂O → Ca(OH)₂ (Canxi hidroxit, hay vôi tôi). Đây là phản ứng tỏa nhiệt mạnh.'
    },
    {
      id: 'acid-rain-tf',
      type: 'fill',
      topic: 'Mưa axit',
      title: '🌧️ Nhận định Đúng / Sai về Mưa axit',
      prompt: 'Đánh giá nhận định sau: "Khí CO₂ là nguyên nhân chính gây ra mưa axit nặng (pH < 4) phá hủy rừng cây và công trình đá vôi." — Điền Đúng hoặc Sai:',
      accepted: ['Sai', 'sai', 'S', 'false'],
      quickChoices: ['Đúng', 'Sai'],
      hint: 'Nước mưa bình thường hòa tan CO₂ có pH khoảng 5.6 (axit rất yếu). Mưa axit nặng có pH < 4.5 thường do khí thải chứa Lưu huỳnh và Nitơ.',
      solution: 'Nhận định trên là SAI. Nguyên nhân chính gây mưa axit nặng là khí SO₂ (từ đốt than/dầu) và NOₓ (từ động cơ, nhà máy), tạo ra axit mạnh H₂SO₄ và HNO₃ trong nước mưa.'
    },
    {
      id: 'fertilizer-fill',
      type: 'fill',
      topic: 'Phân biệt phân bón hóa học',
      title: '🌱 Nhận biết phân đạm Amoni bằng nước vôi trong',
      prompt: 'Để phân biệt phân đạm Amoni clorua (NH₄Cl) với phân Kali (KCl), bà con nông dân cho tác dụng với nước vôi trong Ca(OH)₂ thì thấy phân đạm giải phóng khí mùi khai. Điền công thức khí thoát ra:  ______',
      accepted: ['NH3', 'nh3', 'NH₃'],
      quickChoices: ['NH₃', 'CO₂', 'H₂', 'Cl₂'],
      hint: 'Ion amoni (NH₄⁺) tác dụng với ion kiềm (OH⁻) tạo ra khí có mùi khai đặc trưng của hợp chất Nitơ và Hydro.',
      solution: '2NH₄Cl + Ca(OH)₂ → CaCl₂ + 2NH₃↑ + 2H₂O. Khí NH₃ (amoniac) có mùi khai đặc trưng giúp nhận biết nhanh phân đạm amoni.'
    }
  ];

  CV.modules.chemquest = {
    state: {
      score: 0,
      streak: 0,
      highScore: Number(localStorage.getItem('chemverse_highscore') || 0),
      mode: null, // 'decoder' | 'synth' | 'quiz' | 'daily' | 'balancer' | 'memory'
      round: 0,
      maxRounds: 5,
      targetEl: null,
      hintLevel: 1,
      targetComp: null,
      basket: {},
      quizDiff: 'easy',
      quizIndex: 0,
      quizTimeLeft: 15,
      dailyList: [],
      dailyIndex: 0,
      dailyMode: 'daily'
    },
    quizTimer: null,
    sfxCtx: null,

    playQuestSfx(type) {
      try {
        if (!this.sfxCtx) {
          const Ctx = window.AudioContext || window.webkitAudioContext;
          if (Ctx) this.sfxCtx = new Ctx();
        }
        const ctx = this.sfxCtx;
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        if (type === 'ok') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, t);
          osc.frequency.exponentialRampToValueAtTime(783.99, t + 0.14);
          g.gain.setValueAtTime(0.09, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
          osc.connect(g); g.connect(ctx.destination);
          osc.start(t); osc.stop(t + 0.22);
        } else if (type === 'err') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(210, t);
          osc.frequency.exponentialRampToValueAtTime(140, t + 0.18);
          g.gain.setValueAtTime(0.07, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
          osc.connect(g); g.connect(ctx.destination);
          osc.start(t); osc.stop(t + 0.24);
        } else {
          [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
            const o = ctx.createOscillator();
            const gn = ctx.createGain();
            o.type = 'triangle';
            o.frequency.setValueAtTime(f, t + idx * 0.08);
            gn.gain.setValueAtTime(0.08, t + idx * 0.08);
            gn.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.26);
            o.connect(gn); gn.connect(ctx.destination);
            o.start(t + idx * 0.08); o.stop(t + idx * 0.08 + 0.28);
          });
        }
      } catch (_) {}
    },

    clearQuizTimer() {
      if (this.quizTimer) {
        clearInterval(this.quizTimer);
        this.quizTimer = null;
      }
    },

    init(container) {
      this.container = container;
      this.clearQuizTimer();
      this.renderHub();
    },

    saveHighScore() {
      if (this.state.score > this.state.highScore) {
        this.state.highScore = this.state.score;
        localStorage.setItem('chemverse_highscore', String(this.state.highScore));
      }
    },

    renderHub() {
      this.clearQuizTimer();
      const st = this.state;
      this.container.innerHTML = `
        <div class="page-container">
          <div class="section-header" style="margin-bottom:20px;">
            <div>
              <h2 class="section-title">🚀 ${CV.t('ChemQuiz – Luyện Tập & Trắc Nghiệm Hóa Học', 'ChemQuiz – Speed Quiz & Daily Practice')}</h2>
              <p class="section-subtitle">${CV.t('Chia thành 2 phần độc lập: Quiz tốc độ và Bài tập hằng ngày gắn với đời sống học sinh', 'Two independent sections: Speed Quiz & Everyday Chemistry Practice')}</p>
            </div>
            <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
              <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.navigate('learning')">← Về Học tập</button>
              <div class="glass-surface" style="padding:8px 14px;border-radius:12px;display:flex;gap:14px;">
                <span>🏆 Kỷ lục: <strong class="mono" style="color:#FBBF24;">${st.highScore}</strong></span>
                <span>🔥 Combo: <strong class="mono" style="color:var(--accent-cyan);">${st.streak}</strong></span>
              </div>
            </div>
          </div>

          <!-- 2 PHẦN ĐỘC LẬP: PHẦN 1 (QUIZ) & PHẦN 2 (BÀI TẬP HẰNG NGÀY) -->
          <div class="dual-hub-grid" style="margin-top:0;margin-bottom:26px;">
            <!-- PHẦN 1: QUIZ -->
            <section class="dual-branch-card learn glass-surface">
              <div class="dual-branch-badge">PHẦN 1 • TRẮC NGHIỆM NHANH &amp; ĐỐ VUI</div>
              <div class="dual-branch-head">
                <span class="dual-branch-icon">⚡</span>
                <div>
                  <h2>1. Quiz Phản Xạ Tốc Độ</h2>
                  <p>Nhận diện ký hiệu, đoán nguyên tố, số proton/electron, cấu hình e &amp; phân loại nhóm với đồng hồ đếm ngược 15 giây + chuỗi combo + âm thanh.</p>
                </div>
              </div>
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:4px;">
                <button class="btn btn-primary btn-sm" onclick="CHEMVERSE.modules.chemquest.startQuiz('easy')">🟢 Dễ</button>
                <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.modules.chemquest.startQuiz('medium')">🟡 Trung bình</button>
                <button class="btn btn-secondary btn-sm" style="border-color:rgba(248,113,113,0.45);color:#FCA5A5;" onclick="CHEMVERSE.modules.chemquest.startQuiz('hard')">🔴 Khó</button>
              </div>
            </section>

            <!-- PHẦN 2: BÀI TẬP HẰNG NGÀY -->
            <section class="dual-branch-card research glass-surface">
              <div class="dual-branch-badge">PHẦN 2 • GẦN GŨI ĐỜI SỐNG HỌC SINH</div>
              <div class="dual-branch-head">
                <span class="dual-branch-icon">📅</span>
                <div>
                  <h2>2. Bài Tập Hằng Ngày</h2>
                  <p>Tình huống thực tế (gỉ sét, khử mùi tanh cá, nước ngọt có gas, dập cháy, vôi tôi, mưa axit...) dạng trắc nghiệm, kéo-thả ghép đôi &amp; điền khuyết kèm Gợi ý.</p>
                </div>
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px;">
                <button class="btn btn-primary btn-sm" style="flex:1;background:linear-gradient(135deg,#8B5CF6,#EC4899);" onclick="CHEMVERSE.modules.chemquest.startDailyPractice(true)">🌟 Thử thách mỗi ngày (4 bài)</button>
                <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.modules.chemquest.startDailyPractice(false)">📚 Toàn bộ kho (${DAILY_PRACTICE_BANK.length} bài)</button>
              </div>
            </section>
          </div>

          <!-- TRÒ CHƠI TƯƠNG TÁC BỔ TRỢ -->
          <div style="font-size:0.84rem;color:var(--text-muted);font-weight:700;margin-bottom:10px;letter-spacing:0.04em;">🎮 TRÒ CHƠI HÓA HỌC BỔ TRỢ</div>
          <div class="quest-hub">
            <article class="quest-mode-card glass-surface">
              <div>
                <div style="font-size:1.8rem;margin-bottom:6px;">🛸</div>
                <h3>Giải Mã Hành Tinh Nguyên Tố</h3>
                <p style="color:var(--text-secondary);font-size:0.84rem;margin-top:4px;">Đọc tối đa 3 gợi ý để tìm nguyên tố bí ẩn.</p>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.modules.chemquest.startDecoder()">Bắt đầu Giải mã</button>
            </article>

            <article class="quest-mode-card glass-surface">
              <div>
                <div style="font-size:1.8rem;margin-bottom:6px;">⚗️</div>
                <h3>Xưởng Ghép Hợp Chất</h3>
                <p style="color:var(--text-secondary);font-size:0.84rem;margin-top:4px;">Chọn đúng tỷ lệ nguyên tử tổng hợp phân tử (H₂O, NaCl...).</p>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.modules.chemquest.startSynth()">Vào Xưởng Ghép</button>
            </article>

            <article class="quest-mode-card glass-surface">
              <div>
                <div style="font-size:1.8rem;margin-bottom:6px;">⚖️</div>
                <h3>Cân Bằng Phương Trình</h3>
                <p style="color:var(--text-secondary);font-size:0.84rem;margin-top:4px;">Điền hệ số cân bằng nhanh các phương trình SGK.</p>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.modules.chemquest.startBalancer()">Thử thách Cân bằng</button>
            </article>

            <article class="quest-mode-card glass-surface">
              <div>
                <div style="font-size:1.8rem;margin-bottom:6px;">🃏</div>
                <h3>Lật Thẻ Ghép Đôi</h3>
                <p style="color:var(--text-secondary);font-size:0.84rem;margin-top:4px;">Ghép ký hiệu hóa học với tên &amp; ứng dụng quen thuộc.</p>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.modules.chemquest.startMemory()">Chơi Lật Thẻ</button>
            </article>
          </div>
        </div>
      `;
    },

    // --- MODE 1: DECODER ---
    startDecoder() {
      this.state.mode = 'decoder';
      this.state.score = 0;
      this.state.streak = 0;
      this.state.round = 1;
      this.state.maxRounds = 5;
      this.nextDecoderRound();
    },

    nextDecoderRound() {
      const pool = CV.ELEMENTS.filter((e) => e.number <= 86);
      this.state.targetEl = pool[Math.floor(Math.random() * pool.length)];
      this.state.hintLevel = 1;
      this.renderDecoder();
    },

    renderDecoder() {
      const st = this.state;
      const el = st.targetEl;
      const cat = CV.getCategory(el.category);
      const hints = [
        `Gợi ý 1 (+100đ): Cấu hình electron là <span class="mono" style="color:var(--accent-cyan);">${el.electronConfig}</span> (Số proton: ${el.protons}).`,
        `Gợi ý 2 (+70đ): Thuộc nhóm <strong>${cat.nameVi}</strong>, Chu kỳ ${el.period}, ${el.group ? 'Nhóm ' + el.group : 'Họ f-block'}.`,
        `Gợi ý 3 (+40đ): Ứng dụng thực tế: <em>${el.applications[0]}</em>.`
      ];

      this.container.innerHTML = `
        <div class="page-container">
          <div class="quest-arena glass-surface">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
              <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.modules.chemquest.renderHub()">← Quay lại Hub</button>
              <div class="mono">Lượt ${st.round}/${st.maxRounds} • Điểm: <strong style="color:#FBBF24;">${st.score}</strong> • 🔥 ${st.streak}</div>
            </div>
            <h2 style="margin-bottom:14px;">🛸 Giải Mã Hành Tinh Nguyên Tố</h2>
            <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:18px;">
              ${hints.slice(0, st.hintLevel).map((h) => `<div class="glass-surface" style="padding:12px;border-radius:10px;">${h}</div>`).join('')}
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
              <input type="text" id="cq-dec-input" class="input-field" style="flex:1;min-width:200px;" placeholder="Nhập ký hiệu (Fe) hoặc tên nguyên tố..." />
              <button class="btn btn-primary" id="cq-dec-submit">Kiểm tra</button>
              ${st.hintLevel < 3 ? `<button class="btn btn-secondary" id="cq-dec-hint">Mở gợi ý tiếp theo</button>` : ''}
            </div>
            <div id="cq-dec-feedback" style="margin-top:14px;"></div>
          </div>
        </div>
      `;

      const check = () => {
        const val = document.getElementById('cq-dec-input').value.trim().toLowerCase();
        if (!val) return;
        const ok = val === el.symbol.toLowerCase() || val === el.name.toLowerCase() || val === el.nameVi.toLowerCase();
        const fb = document.getElementById('cq-dec-feedback');
        if (ok) {
          const pts = st.hintLevel === 1 ? 100 : st.hintLevel === 2 ? 70 : 40;
          st.score += pts;
          st.streak += 1;
          this.saveHighScore();
          fb.innerHTML = `<div style="color:#34D399;font-weight:700;">✅ Chính xác! Đó là ${el.nameVi} (${el.symbol})! +${pts} điểm.</div>`;
          setTimeout(() => {
            if (st.round < st.maxRounds) { st.round++; this.nextDecoderRound(); }
            else this.renderSummary('Giải mã hành tinh nguyên tố');
          }, 1200);
        } else {
          st.streak = 0;
          fb.innerHTML = `<div style="color:#F87171;">❌ Chưa đúng! Hãy thử lại hoặc mở thêm gợi ý.</div>`;
        }
      };

      document.getElementById('cq-dec-submit').addEventListener('click', check);
      document.getElementById('cq-dec-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
      const hintBtn = document.getElementById('cq-dec-hint');
      if (hintBtn) hintBtn.addEventListener('click', () => { st.hintLevel++; this.renderDecoder(); });
    },

    // --- MODE 2: COMPOUND SYNTHESIZER ---
    startSynth() {
      this.state.mode = 'synth';
      this.state.score = 0;
      this.state.streak = 0;
      this.state.round = 1;
      this.state.maxRounds = COMPOUNDS.length;
      this.loadSynthRound();
    },

    loadSynthRound() {
      this.state.targetComp = COMPOUNDS[this.state.round - 1];
      this.state.basket = {};
      this.renderSynth();
    },

    renderSynth() {
      const st = this.state;
      const comp = st.targetComp;
      const palette = ['H', 'C', 'N', 'O', 'Na', 'S', 'Cl', 'Ca'];
      const basketText = Object.entries(st.basket)
        .filter(([, cnt]) => cnt > 0)
        .map(([sym, cnt]) => `${sym}${cnt > 1 ? cnt : ''}`)
        .join(' + ') || 'Trống';

      this.container.innerHTML = `
        <div class="page-container">
          <div class="quest-arena glass-surface">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
              <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.modules.chemquest.renderHub()">← Quay lại Hub</button>
              <div class="mono">Hợp chất ${st.round}/${st.maxRounds} • Điểm: <strong style="color:#FBBF24;">${st.score}</strong></div>
            </div>
            <h2>⚗️ Xưởng Ghép Hợp Chất</h2>
            <div class="glass-surface" style="padding:16px;border-radius:12px;margin:14px 0;">
              <div style="font-size:0.82rem;color:var(--text-muted);">Mục tiêu tổng hợp:</div>
              <div style="font-size:1.5rem;font-weight:700;color:var(--accent-cyan);">${comp.formula} – ${comp.name}</div>
            </div>

            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;">
              ${palette.map((sym) => `<button class="btn btn-secondary btn-sm cq-add-atom" data-sym="${sym}">+1 ${sym}</button>`).join('')}
              <button class="btn btn-secondary btn-sm" id="cq-synth-clear">🗑 Làm sạch</button>
            </div>

            <div class="glass-surface" style="padding:14px;border-radius:12px;margin-bottom:16px;">
              <span style="color:var(--text-muted);">Buồng phản ứng:</span> <strong class="mono" style="font-size:1.1rem;color:#FBBF24;">${basketText}</strong>
            </div>

            <button class="btn btn-primary" id="cq-synth-go">⚡ Tổng hợp phân tử</button>
            <div id="cq-synth-fb" style="margin-top:14px;"></div>
          </div>
        </div>
      `;

      document.querySelectorAll('.cq-add-atom').forEach((btn) => {
        btn.addEventListener('click', () => {
          const s = btn.getAttribute('data-sym');
          st.basket[s] = (st.basket[s] || 0) + 1;
          this.renderSynth();
        });
      });
      document.getElementById('cq-synth-clear').addEventListener('click', () => { st.basket = {}; this.renderSynth(); });
      document.getElementById('cq-synth-go').addEventListener('click', () => {
        const reqKeys = Object.keys(comp.req);
        const basKeys = Object.keys(st.basket).filter((k) => st.basket[k] > 0);
        const match = reqKeys.length === basKeys.length && reqKeys.every((k) => st.basket[k] === comp.req[k]);
        const fb = document.getElementById('cq-synth-fb');
        if (match) {
          st.score += 200;
          st.streak += 1;
          this.saveHighScore();
          fb.innerHTML = `<div style="color:#34D399;font-weight:700;">✅ Tổng hợp thành công ${comp.formula}! ${comp.fact}</div>`;
          setTimeout(() => {
            if (st.round < st.maxRounds) { st.round++; this.loadSynthRound(); }
            else this.renderSummary('Xưởng ghép hợp chất');
          }, 1400);
        } else {
          st.streak = 0;
          fb.innerHTML = `<div style="color:#F87171;">❌ Tỷ lệ nguyên tử chưa khớp với ${comp.formula}. Hãy thử lại!</div>`;
        }
      });
    },

    // --- MODE 3: 3-LEVEL SPEED QUIZ WITH TIMER & COMBO ---
    startQuiz(diff = 'easy') {
      this.clearQuizTimer();
      this.state.mode = 'quiz';
      this.state.quizDiff = diff;
      this.state.score = 0;
      this.state.streak = 0;
      this.state.quizIndex = 0;
      const raw = diff === 'easy'
        ? [...QUIZ_BANK.basic]
        : diff === 'hard'
          ? [...QUIZ_BANK.advanced]
          : [...QUIZ_BANK.basic.slice(0, 10), ...QUIZ_BANK.advanced.slice(0, 10)];
      this.state.quizPool = raw.sort(() => Math.random() - 0.5).slice(0, 10);
      this.renderQuiz();
    },

    renderQuiz() {
      this.clearQuizTimer();
      const st = this.state;
      const list = st.quizPool || QUIZ_BANK.basic;
      const diffLabels = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };
      if (st.quizIndex >= list.length) {
        this.playQuestSfx('win');
        this.renderSummary(`Quiz Tốc Độ (${diffLabels[st.quizDiff] || 'Dễ'})`);
        return;
      }
      const item = list[st.quizIndex];
      st.quizTimeLeft = 15;
      let answered = false;

      this.container.innerHTML = `
        <div class="page-container">
          <div class="quest-arena glass-surface">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
              <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.modules.chemquest.renderHub()">← Quay lại ChemQuiz</button>
              <div class="mono" style="display:flex;gap:12px;align-items:center;">
                <span>Câu ${st.quizIndex + 1}/${list.length}</span>
                <span>Điểm: <strong style="color:#FBBF24;">${st.score}</strong></span>
                <span>🔥 Combo x${st.streak}</span>
                <span style="padding:3px 9px;border-radius:8px;background:rgba(0,229,255,0.16);color:#00E5FF;" id="cq-timer-val">⏱ 15s</span>
              </div>
            </div>
            <div style="height:6px;background:rgba(255,255,255,0.1);border-radius:999px;overflow:hidden;margin-bottom:16px;">
              <div id="cq-timer-bar" style="width:100%;height:100%;background:linear-gradient(90deg,#00E5FF,#818CF8);transition:width 0.9s linear;"></div>
            </div>
            <h3 style="font-size:1.2rem;line-height:1.4;">${item.q}</h3>
            <div class="quiz-options">
              ${item.opts.map((o, idx) => `<button class="quiz-option-btn" data-idx="${idx}">${String.fromCharCode(65 + idx)}. ${o}</button>`).join('')}
            </div>
            <div id="cq-quiz-fb" style="margin-top:16px;"></div>
          </div>
        </div>
      `;

      const finishQuestion = (chosen) => {
        if (answered) return;
        answered = true;
        this.clearQuizTimer();
        document.querySelectorAll('.quiz-option-btn').forEach((b, i) => {
          b.disabled = true;
          if (i === item.ans) b.classList.add('correct');
          else if (i === chosen) b.classList.add('wrong');
        });
        const isCorrect = chosen === item.ans;
        if (isCorrect) {
          st.score += 100 + st.streak * 25 + st.quizTimeLeft * 5;
          st.streak += 1;
          this.saveHighScore();
          this.playQuestSfx('ok');
        } else {
          st.streak = 0;
          this.playQuestSfx('err');
        }
        const fb = document.getElementById('cq-quiz-fb');
        if (!fb) return;
        fb.innerHTML = `
          <div class="glass-surface" style="padding:14px;border-radius:12px;">
            <div style="font-weight:700;color:${isCorrect ? '#34D399' : '#F87171'};margin-bottom:4px;">
              ${chosen === -1 ? '⏱ Hết giờ!' : isCorrect ? `✅ Chính xác! (Combo x${st.streak})` : '❌ Chưa chính xác!'}
            </div>
            <p style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:10px;">${item.exp}</p>
            <button class="btn btn-primary btn-sm" id="cq-quiz-next">${st.quizIndex + 1 < list.length ? 'Câu tiếp theo →' : 'Xem tổng kết 🏆'}</button>
          </div>
        `;
        document.getElementById('cq-quiz-next').addEventListener('click', () => {
          st.quizIndex++;
          this.renderQuiz();
        });
      };

      this.quizTimer = setInterval(() => {
        st.quizTimeLeft--;
        const tEl = document.getElementById('cq-timer-val');
        const bEl = document.getElementById('cq-timer-bar');
        if (tEl) {
          tEl.textContent = `⏱ ${st.quizTimeLeft}s`;
          if (st.quizTimeLeft <= 5) tEl.style.color = '#F87171';
        }
        if (bEl) bEl.style.width = `${Math.max(0, (st.quizTimeLeft / 15) * 100)}%`;
        if (st.quizTimeLeft <= 0) finishQuestion(-1);
      }, 1000);

      document.querySelectorAll('.quiz-option-btn').forEach((btn) => {
        btn.addEventListener('click', () => finishQuestion(Number(btn.getAttribute('data-idx'))));
      });
    },

    // --- PART 2: BÀI TẬP HẰNG NGÀY (GẦN GŨI ĐỜI SỐNG HỌC SINH) ---
    startDailyPractice(dailyOnly = true) {
      this.clearQuizTimer();
      const st = this.state;
      st.mode = 'daily';
      st.score = 0;
      st.streak = 0;
      st.dailyIndex = 0;
      st.dailyMode = dailyOnly ? 'daily' : 'all';
      if (dailyOnly) {
        const daySeed = new Date().getDate();
        const picked = [];
        for (let i = 0; i < 4; i++) {
          picked.push(DAILY_PRACTICE_BANK[(daySeed + i * 2) % DAILY_PRACTICE_BANK.length]);
        }
        st.dailyList = picked;
      } else {
        st.dailyList = [...DAILY_PRACTICE_BANK];
      }
      this.renderDailyPractice();
    },

    renderDailyPractice() {
      const st = this.state;
      const list = st.dailyList;
      if (st.dailyIndex >= list.length) {
        this.playQuestSfx('win');
        this.renderSummary(st.dailyMode === 'daily' ? 'Thử Thách Hằng Ngày' : 'Kho Bài Tập Đời Sống');
        return;
      }
      const ex = list[st.dailyIndex];
      let bodyHtml = '';

      if (ex.type === 'situation') {
        bodyHtml = `
          <div class="quiz-options" id="cq-daily-opts">
            ${ex.opts.map((o, idx) => `<button class="quiz-option-btn" data-idx="${idx}">${String.fromCharCode(65 + idx)}. ${o}</button>`).join('')}
          </div>`;
      } else if (ex.type === 'fill') {
        bodyHtml = `
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin:14px 0;" id="cq-daily-chips">
            ${ex.quickChoices.map((c) => `<button class="btn btn-secondary btn-sm cq-fill-chip" data-val="${c}">${c}</button>`).join('')}
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
            <input type="text" id="cq-daily-input" class="input-field" style="flex:1;min-width:180px;" placeholder="Nhập đáp án hoặc chọn gợi ý phía trên..." />
            <button class="btn btn-primary" id="cq-daily-submit">Nộp bài ✓</button>
          </div>`;
      } else if (ex.type === 'match') {
        const shuffledRights = [...ex.pairs.map((p) => p.right)].sort(() => Math.random() - 0.5);
        bodyHtml = `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0;" id="cq-match-grid">
            <div style="display:flex;flex-direction:column;gap:8px;" id="cq-match-lefts">
              ${ex.pairs.map((p, i) => `
                <div class="glass-surface cq-match-slot" data-lidx="${i}" data-expected="${p.right.replace(/"/g, '&quot;')}" style="padding:10px;border-radius:10px;font-size:0.84rem;border:1px dashed rgba(56,189,248,0.45);cursor:pointer;">
                  <div><strong>${i + 1}.</strong> ${p.left}</div>
                  <div class="mono cq-slot-ans" style="font-size:0.76rem;color:#FBBF24;margin-top:4px;">(Kéo hoặc bấm thẻ bên phải vào đây)</div>
                </div>`).join('')}
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;" id="cq-match-rights">
              ${shuffledRights.map((r) => `
                <button class="btn btn-secondary btn-sm cq-match-drag" draggable="true" data-val="${r.replace(/"/g, '&quot;')}" style="justify-content:flex-start;text-align:left;padding:10px;white-space:normal;height:auto;">
                  🧩 ${r}
                </button>`).join('')}
            </div>
          </div>
          <button class="btn btn-primary" id="cq-match-check">Kiểm tra ghép đôi ✓</button>`;
      }

      this.container.innerHTML = `
        <div class="page-container">
          <div class="quest-arena glass-surface">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
              <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.modules.chemquest.renderHub()">← Quay lại ChemQuiz</button>
              <div class="mono">Bài ${st.dailyIndex + 1}/${list.length} • <span style="color:#E879F9;">${ex.topic}</span> • Điểm: <strong style="color:#FBBF24;">${st.score}</strong></div>
            </div>

            <h3 style="font-size:1.18rem;margin-bottom:8px;">${ex.title}</h3>
            <p style="color:var(--text-secondary);font-size:0.94rem;line-height:1.5;margin-bottom:12px;">${ex.prompt}</p>

            <div style="margin-bottom:10px;">
              <button class="btn btn-secondary btn-sm" id="cq-daily-hint-btn">💡 Gợi ý tư duy</button>
              <div id="cq-daily-hint-box" class="glass-surface" style="display:none;margin-top:8px;padding:10px 12px;border-radius:10px;font-size:0.84rem;color:#93C5FD;border-color:rgba(56,189,248,0.4);">
                💡 <strong>Gợi ý:</strong> ${ex.hint}
              </div>
            </div>

            ${bodyHtml}
            <div id="cq-daily-fb" style="margin-top:14px;"></div>
          </div>
        </div>
      `;

      document.getElementById('cq-daily-hint-btn').addEventListener('click', () => {
        const hb = document.getElementById('cq-daily-hint-box');
        hb.style.display = hb.style.display === 'none' ? 'block' : 'none';
      });

      const showDailyFeedback = (isOk) => {
        if (isOk) {
          st.score += 150;
          st.streak += 1;
          this.saveHighScore();
          this.playQuestSfx('ok');
        } else {
          st.streak = 0;
          this.playQuestSfx('err');
        }
        const fb = document.getElementById('cq-daily-fb');
        fb.innerHTML = `
          <div class="glass-surface" style="padding:14px;border-radius:12px;border-color:${isOk ? '#10B981' : '#EF4444'};">
            <div style="font-weight:700;color:${isOk ? '#34D399' : '#F87171'};margin-bottom:6px;">
              ${isOk ? '✅ Tuyệt vời! Chính xác (+150 điểm)' : '❌ Chưa chuẩn xác — Xem lời giải nhé!'}
            </div>
            <div style="font-size:0.88rem;color:var(--text-secondary);margin-bottom:10px;">
              <strong>📖 Lời giải chi tiết:</strong> ${ex.solution}
            </div>
            <button class="btn btn-primary btn-sm" id="cq-daily-next">${st.dailyIndex + 1 < list.length ? 'Bài tiếp theo →' : 'Hoàn thành 🏆'}</button>
          </div>`;
        document.getElementById('cq-daily-next').addEventListener('click', () => {
          st.dailyIndex++;
          this.renderDailyPractice();
        });
      };

      if (ex.type === 'situation') {
        document.querySelectorAll('#cq-daily-opts button').forEach((btn) => {
          btn.addEventListener('click', () => {
            const chosen = Number(btn.getAttribute('data-idx'));
            document.querySelectorAll('#cq-daily-opts button').forEach((b, i) => {
              b.disabled = true;
              if (i === ex.ans) b.classList.add('correct');
              else if (i === chosen) b.classList.add('wrong');
            });
            showDailyFeedback(chosen === ex.ans);
          });
        });
      } else if (ex.type === 'fill') {
        const inp = document.getElementById('cq-daily-input');
        document.querySelectorAll('.cq-fill-chip').forEach((c) => {
          c.addEventListener('click', () => { inp.value = c.getAttribute('data-val'); });
        });
        document.getElementById('cq-daily-submit').addEventListener('click', () => {
          const val = (inp.value || '').trim().replace(/\s+/g, '');
          const isOk = ex.accepted.some((a) => a.toLowerCase() === val.toLowerCase());
          document.getElementById('cq-daily-submit').disabled = true;
          showDailyFeedback(isOk);
        });
      } else if (ex.type === 'match') {
        let selectedRight = null;
        document.querySelectorAll('.cq-match-drag').forEach((btn) => {
          btn.addEventListener('dragstart', (e) => {
            selectedRight = btn.getAttribute('data-val');
            if (e.dataTransfer) e.dataTransfer.setData('text/plain', selectedRight);
          });
          btn.addEventListener('click', () => {
            selectedRight = btn.getAttribute('data-val');
            document.querySelectorAll('.cq-match-drag').forEach((b) => {
              b.className = `btn btn-sm ${b === btn ? 'btn-primary' : 'btn-secondary'} cq-match-drag`;
            });
          });
        });
        document.querySelectorAll('.cq-match-slot').forEach((slot) => {
          const assign = (val) => {
            if (!val) return;
            slot.setAttribute('data-chosen', val);
            slot.querySelector('.cq-slot-ans').textContent = `→ ${val}`;
            slot.style.borderColor = '#00E5FF';
          };
          slot.addEventListener('dragover', (e) => e.preventDefault());
          slot.addEventListener('drop', (e) => {
            e.preventDefault();
            const val = (e.dataTransfer && e.dataTransfer.getData('text/plain')) || selectedRight;
            assign(val);
          });
          slot.addEventListener('click', () => assign(selectedRight));
        });
        document.getElementById('cq-match-check').addEventListener('click', () => {
          const slots = Array.from(document.querySelectorAll('.cq-match-slot'));
          const allRight = slots.every((s) => s.getAttribute('data-chosen') === s.getAttribute('data-expected'));
          document.getElementById('cq-match-check').disabled = true;
          showDailyFeedback(allRight);
        });
      }
    },

    // --- MODE 4: EQUATION BALANCER ---
    startBalancer() {
      const EQ_LIST = [
        { parts: ['Fe', '+', 'O₂', '→', 'Fe₃O₄'], ans: [3, 2, 1] },
        { parts: ['Al', '+', 'HCl', '→', 'AlCl₃', '+', 'H₂'], ans: [2, 6, 2, 3] },
        { parts: ['Na', '+', 'H₂O', '→', 'NaOH', '+', 'H₂'], ans: [2, 2, 2, 1] },
        { parts: ['Fe₂O₃', '+', 'CO', '→', 'Fe', '+', 'CO₂'], ans: [1, 3, 2, 3] },
        { parts: ['Cu', '+', 'HNO₃', '→', 'Cu(NO₃)₂', '+', 'NO₂', '+', 'H₂O'], ans: [1, 4, 1, 2, 2] },
        { parts: ['KClO₃', '→', 'KCl', '+', 'O₂'], ans: [2, 2, 3] }
      ];
      this.state.mode = 'balancer';
      this.state.score = 0;
      this.state.streak = 0;
      this.state.balList = EQ_LIST;
      this.state.balIdx = 0;
      this.loadBalancerRound();
    },

    loadBalancerRound() {
      const item = this.state.balList[this.state.balIdx];
      this.state.balInputs = item.ans.map(() => 1);
      this.renderBalancer();
    },

    renderBalancer() {
      const st = this.state;
      const item = st.balList[st.balIdx];
      let slotIdx = 0;
      const eqHtml = item.parts
        .map((p) => {
          if (p === '+' || p === '→') return `<span style="font-size:1.3rem;margin:0 6px;color:var(--accent-cyan);">${p}</span>`;
          const curIdx = slotIdx++;
          return `
            <span style="display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,0.06);padding:4px 8px;border-radius:10px;border:1px solid var(--glass-border);">
              <input type="number" min="1" max="12" value="${st.balInputs[curIdx]}" data-bidx="${curIdx}" class="input-field mono cq-bal-inp" style="width:46px;padding:4px;text-align:center;font-weight:700;color:#FBBF24;" />
              <strong class="mono" style="font-size:1.1rem;">${p}</strong>
            </span>`;
        })
        .join('');

      this.container.innerHTML = `
        <div class="page-container">
          <div class="quest-arena glass-surface">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
              <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.modules.chemquest.renderHub()">← Quay lại Hub</button>
              <div class="mono">Phương trình ${st.balIdx + 1}/${st.balList.length} • Điểm: <strong style="color:#FBBF24;">${st.score}</strong> • 🔥 ${st.streak}</div>
            </div>
            <h2>⚖️ Cân Bằng Phương Trình Siêu Tốc</h2>
            <p style="color:var(--text-muted);font-size:0.88rem;margin:6px 0 18px;">Nhập hệ số nguyên tối giản thích hợp vào từng ô trống để cân bằng số nguyên tử hai vế.</p>
            <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;padding:20px;border-radius:14px;background:rgba(0,0,0,0.28);margin-bottom:18px;">
              ${eqHtml}
            </div>
            <button class="btn btn-primary" id="cq-bal-check">✓ Kiểm tra cân bằng</button>
            <div id="cq-bal-fb" style="margin-top:14px;"></div>
          </div>
        </div>
      `;

      document.querySelectorAll('.cq-bal-inp').forEach((inp) => {
        inp.addEventListener('input', (e) => {
          st.balInputs[Number(inp.getAttribute('data-bidx'))] = Math.max(1, Number(e.target.value) || 1);
        });
      });

      document.getElementById('cq-bal-check').addEventListener('click', () => {
        const ok = item.ans.every((v, i) => st.balInputs[i] === v);
        const fb = document.getElementById('cq-bal-fb');
        if (ok) {
          st.score += 150 + st.streak * 25;
          st.streak += 1;
          this.saveHighScore();
          fb.innerHTML = `<div style="color:#34D399;font-weight:700;">✅ Chính xác tuyệt đối! +${150 + (st.streak - 1) * 25} điểm.</div>`;
          setTimeout(() => {
            if (st.balIdx + 1 < st.balList.length) { st.balIdx++; this.loadBalancerRound(); }
            else this.renderSummary('Cân bằng phương trình siêu tốc');
          }, 1100);
        } else {
          st.streak = 0;
          fb.innerHTML = `<div style="color:#F87171;">❌ Hai vế chưa cân bằng (hoặc chưa tối giản). Hãy kiểm tra lại số nguyên tử mỗi nguyên tố!</div>`;
        }
      });
    },

    // --- MODE 5: MEMORY FLIP CARDS ---
    startMemory() {
      const PAIRS = [
        { key: 'Fe', a: 'Fe (Z=26)', b: 'Sắt • Tạo hồng cầu máu' },
        { key: 'Na', a: 'Na (Z=11)', b: 'Natri • Thành phần muối ăn' },
        { key: 'Cu', a: 'Cu (Z=29)', b: 'Đồng • Lõi dây dẫn điện' },
        { key: 'Au', a: 'Au (Z=79)', b: 'Vàng • Kim loại quý màu vàng' },
        { key: 'Cl', a: 'Cl (Z=17)', b: 'Clo • Khử trùng nước sạch' },
        { key: 'Ca', a: 'Ca (Z=20)', b: 'Canxi • Cấu tạo xương & răng' }
      ];
      const deck = [];
      PAIRS.forEach((p) => {
        deck.push({ key: p.key, text: p.a, flipped: false, matched: false });
        deck.push({ key: p.key, text: p.b, flipped: false, matched: false });
      });
      deck.sort(() => Math.random() - 0.5);
      this.state.mode = 'memory';
      this.state.score = 0;
      this.state.memDeck = deck;
      this.state.memFirst = null;
      this.state.memMoves = 0;
      this.state.memLock = false;
      this.renderMemory();
    },

    renderMemory() {
      const st = this.state;
      const matchedPairs = st.memDeck.filter((c) => c.matched).length / 2;
      this.container.innerHTML = `
        <div class="page-container">
          <div class="quest-arena glass-surface">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
              <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.modules.chemquest.renderHub()">← Quay lại Hub</button>
              <div class="mono">Đã ghép: <strong>${matchedPairs}/6</strong> • Số lượt lật: <strong>${st.memMoves}</strong></div>
            </div>
            <h2>🃏 Lật Thẻ Ghép Đôi Nguyên Tố</h2>
            <p style="color:var(--text-muted);font-size:0.86rem;margin:4px 0 16px;">Lật 2 thẻ bất kỳ để ghép đúng Ký hiệu hóa học với Tên & Ứng dụng quen thuộc.</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;">
              ${st.memDeck
                .map((card, idx) => {
                  const open = card.flipped || card.matched;
                  return `
                  <button class="glass-surface cq-mem-card" data-midx="${idx}" ${card.matched ? 'disabled' : ''} style="min-height:84px;padding:10px;border-radius:12px;cursor:${card.matched ? 'default' : 'pointer'};border-color:${
                    card.matched ? '#10B981' : open ? '#00E5FF' : 'var(--glass-border)'
                  };background:${card.matched ? 'rgba(16,185,129,0.18)' : open ? 'rgba(0,229,255,0.12)' : 'rgba(15,23,42,0.75)'};font-weight:700;font-size:0.86rem;">
                    ${open ? card.text : '✦ CHEMVERSE'}
                  </button>`;
                })
                .join('')}
            </div>
          </div>
        </div>
      `;

      document.querySelectorAll('.cq-mem-card').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (st.memLock) return;
          const idx = Number(btn.getAttribute('data-midx'));
          const card = st.memDeck[idx];
          if (card.flipped || card.matched) return;
          card.flipped = true;

          if (st.memFirst === null) {
            st.memFirst = idx;
            this.renderMemory();
          } else {
            st.memMoves++;
            const firstCard = st.memDeck[st.memFirst];
            if (firstCard.key === card.key) {
              firstCard.matched = true;
              card.matched = true;
              st.score += 120;
              st.memFirst = null;
              this.renderMemory();
              if (st.memDeck.every((c) => c.matched)) {
                st.score = Math.max(200, st.score - st.memMoves * 10);
                setTimeout(() => this.renderSummary('Lật thẻ ghép đôi nguyên tố'), 700);
              }
            } else {
              st.memLock = true;
              this.renderMemory();
              setTimeout(() => {
                firstCard.flipped = false;
                card.flipped = false;
                st.memFirst = null;
                st.memLock = false;
                this.renderMemory();
              }, 750);
            }
          }
        });
      });
    },

    renderSummary(modeTitle) {
      const st = this.state;
      this.saveHighScore();
      if (CV.Player && st.score > 0) {
        CV.Player.recordEvent('quest', `Hoàn thành ${modeTitle} (${st.score}đ)`, Math.max(20, Math.round(st.score / 10)));
      }
      const rank =
        st.score >= 800 ? '🌌 Huyền thoại Vũ trụ Hóa học' :
        st.score >= 400 ? '🚀 Chỉ huy Nguyên tố' : '🛸 Phi hành gia Tập sự';
      this.container.innerHTML = `
        <div class="page-container">
          <div class="quest-arena glass-surface" style="text-align:center;">
            <div style="font-size:3rem;margin-bottom:10px;">🏆</div>
            <h2>Hoàn Thành Nhiệm Vụ!</h2>
            <div class="cat-badge" style="color:var(--accent-cyan);margin:8px auto;">Danh hiệu: ${rank}</div>
            <p style="color:var(--text-muted);margin:6px 0 18px;">Chế độ: ${modeTitle}</p>
            <div style="font-size:2.4rem;font-weight:700;color:#FBBF24;" class="mono">${st.score} điểm</div>
            <p style="color:var(--text-secondary);margin:8px 0 22px;">Kỷ lục cá nhân: <strong class="mono">${st.highScore}</strong> điểm</p>
            <button class="btn btn-primary" onclick="CHEMVERSE.modules.chemquest.renderHub()">Quay về Trung tâm ChemQuest</button>
          </div>
        </div>
      `;
    }
  };
})();
