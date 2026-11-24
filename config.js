/**
 * Cấu hình nội dung cho Thiệp mời Tốt nghiệp — Axie Lunacia Survival Edition.
 */
window.INVITE_CONFIG = {
  graduate: {
    fullName: "Nguyễn Minh Anh",
    shortName: "Minh Anh",
    firstName: "Minh Anh",
    tag: "MinhAnh#2026",
    level: "Lv.2026",
    xpText: "4000 / 4000 EXP",
    role: "Tân Cử Nhân · Khóa 2022–2026",
    school: "Đại học Y Dược TP. Hồ Chí Minh",
    year: "2026",
    postmarkDate: "04.12",
  },

  event: {
    isoDate: "2026-12-04T15:00:00+07:00",
    timeLabel: "15:00 · Thứ Sáu",
    monthLabel: "Tháng 12",
    dayLabel: "04",
    yearLabel: "Năm 2026",
    placeName: "Hội trường A · Giảng đường Trung tâm",
    placeSub: "Cơ sở 2",
    address: "217 Hồng Bàng, Phường 11, Quận 5, TP. Hồ Chí Minh",
    mapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=217+Hong+Bang+Quan+5+TP+Ho+Chi+Minh",
  },

  defaults: {
    toEnvelope: "những người thân yêu",
    toCard: "Những người thân yêu",
    toRsvp: "Bạn",
    toClosing: "bạn",
  },

  musicSrc: "assets/bg-music.wav",

  media: {
    meadowBg: "assets/meadow-bg.jpg",
    mascotsTrio: "assets/mascots-trio.jpg",
    avatar: "assets/hero.jpg",
    letterPortrait: "assets/hero-cutout.webp",
    tallBg: "assets/meadow-bg.jpg",
    tallPortrait: "assets/diploma.jpg",
    archBg: "assets/campus-bg.jpg",
    archPortrait: "assets/album-arch.jpg",
    closingPortrait: "assets/closing.jpg",
  },

  // Cấu hình 4 cấp độ của Mini-Game "Hành Trình 4 Năm"
  gameStages: [
    {
      level: 1,
      minScore: 0,
      badge: "NĂM 1 · LV.1",
      bannerTitle: "KÌ 1 · NĂM NHẤT",
      bannerSub: "Né Vật lý đại cương, Đại số & Giải tích 1!",
      skyTop: "#7edff2",
      skyBot: "#d8f8e8",
      hillColor: "#65c962",
      groundColor: "#8c5732",
      grassColor: "#48b04b",
      speed: 4.3,
      obstacles: [
        { label: "Giải tích 1", kind: "ground", color: "#e84245", icon: "∫", fail: "Trượt GIẢI TÍCH 1 ngay kì đầu! Làm cốc trà đá lấy lại tinh thần rồi thi lại nhé!" },
        { label: "Đại số", kind: "ground", color: "#f59e0b", icon: "∑", fail: "Lạc lối trong ma trận ĐẠI SỐ TUYẾN TÍNH! Hẹn gặp lại ở lớp học ghép..." },
        { label: "Vật lý ĐC", kind: "air", color: "#25a9e0", icon: "⚛", fail: "Va trúng con lắc VẬT LÝ ĐẠI CƯƠNG! Nhớ cúi đầu né mấy công thức bay nhé!" },
      ],
    },
    {
      level: 2,
      minScore: 25,
      badge: "NĂM 2 · LV.2",
      bannerTitle: "LÊN NĂM 2 · LV.2",
      bannerSub: "Cảnh báo combo Giải tích 2, 3 bay ngập trời!",
      skyTop: "#64d2ec",
      skyBot: "#fff4cf",
      hillColor: "#58bd58",
      groundColor: "#7e4b2a",
      grassColor: "#3ea145",
      speed: 5.0,
      obstacles: [
        { label: "Giải tích 2", kind: "ground", color: "#e84245", icon: "∬", fail: "Tích phân bội GIẢI TÍCH 2 chặn đường! Chuẩn bị ôn thi lại cùng đồng đội thôi!" },
        { label: "Giải tích 3", kind: "air", color: "#8b5cf6", icon: "∮", fail: "Trượt GIẢI TÍCH 3! Hẹn gặp lại ở kì hè, nhớ chuẩn bị tiền học lại... ☀" },
        { label: "Thực hành Lý", kind: "ground", color: "#0ea5e9", icon: "⚡", fail: "Sai số đo thí nghiệm VẬT LÝ! Thầy yêu cầu làm lại báo cáo thực hành!" },
      ],
    },
    {
      level: 3,
      minScore: 52,
      badge: "NĂM 3 · LV.3",
      bannerTitle: "LÊN NĂM 3 · LV.3",
      bannerSub: "Chạy Deadline 23:59 & Chuyên ngành!",
      skyTop: "#fbb06c",
      skyBot: "#ffe9c6",
      hillColor: "#6db34a",
      groundColor: "#6d4024",
      grassColor: "#488f39",
      speed: 5.6,
      obstacles: [
        { label: "Deadline 23:59", kind: "air", color: "#dc2626", icon: "⏰", fail: "Nộp bài trễ 23:59:01! Hệ thống đóng cổng rồi bạn ơi!" },
        { label: "Chuyên ngành", kind: "ground", color: "#d97706", icon: "📚", fail: "Bị môn CHUYÊN NGÀNH làm choáng váng! Nạp thêm cà phê rồi chạy tiếp!" },
        { label: "Thực tập", kind: "ground", color: "#059669", icon: "💼", fail: "Sốc nhẹ ngày đầu đi THỰC TẬP! Hít sâu thở đều rồi chiến tiếp!" },
      ],
    },
    {
      level: 4,
      minScore: 78,
      badge: "NĂM 4 · FINAL",
      bannerTitle: "NĂM TƯ · ĐỒ ÁN",
      bannerSub: "Vượt Boss Đồ án Tốt nghiệp để nhận bằng!",
      skyTop: "#ff9b71",
      skyBot: "#fff0c9",
      hillColor: "#53a653",
      groundColor: "#5c2d13",
      grassColor: "#3c8c41",
      speed: 6.2,
      obstacles: [
        { label: "Đồ án TN", kind: "ground", color: "#b91c1c", icon: "📜", fail: "Giảng viên hướng dẫn yêu cầu sửa ĐỒ ÁN lần thứ N! Cố lên sắp tới đích rồi!" },
        { label: "Hội đồng", kind: "air", color: "#7c3aed", icon: "🎤", fail: "Bị câu hỏi phản biện HỘI ĐỒNG đánh úp! Đọc kỹ slide rồi bảo vệ lại nào!" },
        { label: "Slide 50p", kind: "ground", color: "#ea580c", icon: "💻", fail: "Laptop đứng hình trước giờ bảo vệ! Nhớ sao lưu dự phòng nhé!" },
      ],
    },
  ],

  album: {
    // Trang 1: 3 Thước phim thử thách vượt ải dạng pixel-chibi Axie!
    page1: [
      [
        {
          type: "challenge",
          scene: "year1",
          ar: "16 / 9",
          orb: "Lv1",
          theme: "emerald",
          tag: "Năm 1 · Vượt ải",
          title: "KÌ 1: VẬT LÝ ĐC · ĐẠI SỐ · GIẢI TÍCH 1",
          alt: "Video thử thách Năm 1 vượt qua Vật lý đại cương và Giải tích 1",
        },
      ],
      [
        {
          type: "challenge",
          scene: "year23",
          ar: "1 / 1",
          orb: "Lv2",
          theme: "sky",
          tag: "Năm 2-3 · Né đòn",
          title: "GIẢI TÍCH 2-3 & DEADLINE",
          alt: "Video thử thách Năm 2-3 vượt qua Giải tích 2, 3 và Deadline",
        },
        {
          type: "challenge",
          scene: "year4",
          ar: "1 / 1",
          orb: "Lv4",
          theme: "gold",
          tag: "Năm 4 · Boss",
          title: "ĐỒ ÁN TỐT NGHIỆP ✓",
          alt: "Video thử thách Năm 4 hoàn thành Đồ án Tốt nghiệp",
        },
      ],
    ],
    page2: [
      [
        {
          type: "image",
          src: "assets/mascots-trio.jpg",
          ar: "16 / 9",
          orb: "★",
          theme: "gold",
          tag: "Party!",
          alt: "Biệt đội tốt nghiệp nhí nhảnh",
        },
      ],
      [
        {
          type: "image",
          src: "assets/diploma.jpg",
          ar: "2 / 3",
          orb: "01",
          theme: "emerald",
          tag: "Hero",
          alt: "Chân dung cầm bằng tốt nghiệp",
        },
        {
          type: "image",
          src: "assets/album-friends.jpg",
          ar: "4 / 3",
          orb: "02",
          theme: "sky",
          tag: "Squad",
          alt: "Khoảnh khắc tốt nghiệp cùng bạn bè",
        },
      ],
    ],
    page3: [
      [
        {
          type: "image",
          src: "assets/hero.jpg",
          ar: "3 / 4",
          orb: "03",
          theme: "emerald",
          tag: "Bloom",
          alt: "Nụ cười ngày tốt nghiệp",
        },
        {
          type: "image",
          src: "assets/album-arch.jpg",
          ar: "3 / 4",
          orb: "04",
          theme: "sky",
          tag: "Arch",
          alt: "Dưới mái vòm trường cũ",
        },
      ],
      [
        {
          type: "image",
          src: "assets/album-bouquet.jpg",
          ar: "1 / 1",
          orb: "05",
          theme: "gold",
          tag: "Gift",
          alt: "Bó hoa hồng kem ngày lễ",
        },
        {
          type: "image",
          src: "assets/album-still.jpg",
          ar: "3 / 2",
          orb: "06",
          theme: "coral",
          tag: "Scroll",
          alt: "Mũ cử nhân, bằng và hoa",
        },
      ],
    ],
  },

  thanksParagraphs: [
    "Hành trình 4 năm từ Lv.1 Năm nhất vật lộn với Giải tích 1, 2, 3, Đại số và Vật lý đại cương cho tới Boss cuối Đồ án Tốt nghiệp cuối cùng cũng đạt 100% EXP.",
    "Cảm ơn ba mẹ đã luôn là hậu phương vững chắc nhất, âm thầm tin tưởng và buff trọn vẹn yêu thương để con hoàn thành nhiệm vụ thanh xuân này.",
    "Cảm ơn thầy cô, đồng đội và những người thương đã lập tổ đội đi cùng mình qua đoạn đường thật đẹp — từng lời động viên đều là vật phẩm quý giá nhất.",
    "Nếu có thể, hẹn gặp mọi người ở cổng hội trường chiều 04.12 này để cùng mở rương kỷ niệm và chụp thật nhiều ảnh nhé!",
  ],

  closingQuote:
    "Sự hiện diện của mọi người chính là phần thưởng trân quý nhất trong ngày hoàn thành hành trình 4 năm của Minh Anh",

  guestbookEndpoint: "",

  initialWishes: [
    {
      id: "w-1",
      name: "Gia đình nhỏ",
      attend: "yes",
      message:
        "Chúc mừng con gái đã chính thức hoàn thành chặng đường đại học thật rực rỡ. Ba mẹ luôn tự hào về con!",
      image: "",
    },
    {
      id: "w-2",
      name: "Thảo Vy",
      attend: "yes",
      message:
        "Chơi game qua ải Đồ án mà cười xỉu! 04.12 nhất định có mặt sớm ôm bó hoa thiệt bự chờ sẵn ở hội trường nha!",
      image: "assets/album-bouquet.jpg",
    },
    {
      id: "w-3",
      name: "Hoàng Nam",
      attend: "yes",
      message:
        "Nhớ hồi năm nhất cùng nhau cày Giải tích 3 với Vật lý đại cương mà giờ đã lên Lv.2026 tốt nghiệp rồi. Chúc mừng tân cử nhân!",
      image: "",
    },
    {
      id: "w-4",
      name: "Cô Lan · Giảng viên",
      attend: "yes",
      message:
        "Chúc mừng Minh Anh tốt nghiệp! Mong em luôn giữ vững ngọn lửa yêu nghề, sự tận tâm và nụ cười rạng rỡ như ngày hôm nay.",
      image: "",
    },
    {
      id: "w-5",
      name: "Tổ đội A3",
      attend: "yes",
      message:
        "Hẹn nhau 15h ngày 04.12 ở sân trường chụp 1001 tấm hình nha! GGWP tân cử nhân!",
      image: "assets/album-friends.jpg",
    },
    {
      id: "w-6",
      name: "Anh Hai",
      attend: "no",
      message:
        "Hôm đó anh đi công tác xa không kịp về dự trực tiếp được, gửi lời chúc mừng tốt nghiệp thật lớn tới em gái. Cuối tuần về anh khao một bữa thật to nhé!",
      image: "",
    },
  ],
};
