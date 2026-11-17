// Gerbang pilihan tanggal lahir sebelum membuka halaman surat.
const quiz = document.getElementById("birthdayQuiz");
const feedback = document.getElementById("birthdayFeedback");
const openQuizButton = document.getElementById("openBirthdayQuiz");
const closeQuizButton = document.getElementById("closeBirthdayQuiz");
const correctBirthdayButton = document.getElementById("correctBirthday");
const wrongBirthdayButton = document.getElementById("wrongBirthday");
const backToChoicesButton = document.getElementById("backToChoices");
const birthdayMusic = document.getElementById("birthdayMusic");
const musicToggle = document.getElementById("musicToggle");
const homeSlide = document.getElementById("slide-home");
const letterSlide = document.getElementById("slide-letter");
let birthdayUnlocked = false;

function showQuiz() {
  quiz.classList.add("is-open");
  quiz.setAttribute("aria-hidden", "false");
}
function hideQuiz() {
  quiz.classList.remove("is-open");
  quiz.setAttribute("aria-hidden", "true");
}
function showWrongAnswer() {
  feedback.classList.add("is-open");
  feedback.setAttribute("aria-hidden", "false");
}
function hideWrongAnswer() {
  feedback.classList.remove("is-open");
  feedback.setAttribute("aria-hidden", "true");
}

openQuizButton.addEventListener("click", showQuiz);
closeQuizButton.addEventListener("click", hideQuiz);
wrongBirthdayButton.addEventListener("click", showWrongAnswer);
backToChoicesButton.addEventListener("click", () => {
  hideWrongAnswer();
  showQuiz();
});
feedback.addEventListener("click", (event) => {
  if (event.target === feedback) hideWrongAnswer();
});
quiz.addEventListener("click", (event) => {
  if (event.target === quiz) hideQuiz();
});

// Musik mulai setelah jawaban benar, sesuai aturan autoplay browser.
correctBirthdayButton.addEventListener("click", async () => {
  birthdayUnlocked = true;
  hideQuiz();
  letterSlide.checked = true;
  musicToggle.hidden = false;
  try {
    await birthdayMusic.play();
    musicToggle.innerHTML = '♫ <span>Music on</span>';
    musicToggle.setAttribute("aria-label", "Jeda musik");
    musicToggle.title = "Jeda musik";
  } catch (error) {
    musicToggle.innerHTML = '♫ <span>Play music</span>';
    musicToggle.setAttribute("aria-label", "Putar musik");
    musicToggle.title = "Putar musik";
  }
});

musicToggle.addEventListener("click", async () => {
  if (birthdayMusic.paused) {
    try { await birthdayMusic.play(); } catch (error) { /* file musik belum tersedia */ }
  } else {
    birthdayMusic.pause();
  }
  const playing = !birthdayMusic.paused;
  musicToggle.innerHTML = playing ? '♫ <span>Music on</span>' : '♫ <span>Music off</span>';
  musicToggle.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");
  musicToggle.title = playing ? "Jeda musik" : "Putar musik";
});

// Mencegah halaman 2 dibuka lewat navigasi lain sebelum tanggal benar dipilih.
document.querySelectorAll('input[name="slide"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio === letterSlide && !birthdayUnlocked) {
      homeSlide.checked = true;
      showQuiz();
    }
  });
});

const memoryModal = document.getElementById("memoryModal");
const selectedMemory = document.getElementById("selectedMemory");
const closeMemory = document.getElementById("closeMemory");
const wishDelivery = document.getElementById("wishDelivery");
const closeDelivery = document.getElementById("closeDelivery");

// Saat foto polaroid diklik, tampilkan landak yang memeluk foto tersebut.
document.querySelectorAll(".polaroid .photo-open").forEach((button) => {
  button.addEventListener("click", () => {
    const photo = button.querySelector("img");
    selectedMemory.src = photo.src;
    selectedMemory.alt = photo.alt;
    memoryModal.classList.add("is-open");
    memoryModal.setAttribute("aria-hidden", "false");
  });
});

function hideMemory() {
  memoryModal.classList.remove("is-open");
  memoryModal.setAttribute("aria-hidden", "true");
}
closeMemory.addEventListener("click", hideMemory);
memoryModal.addEventListener("click", (event) => {
  if (event.target === memoryModal) hideMemory();
});

// Klik landak pada halaman Make a Wish untuk mengirim surat ke landak lain.
document.getElementById("sendWish").addEventListener("click", () => {
  wishDelivery.classList.remove("is-open");
  void wishDelivery.offsetWidth; // restart animasi setiap kali dibuka
  wishDelivery.classList.add("is-open");
  wishDelivery.setAttribute("aria-hidden", "false");
});
function hideDelivery() {
  wishDelivery.classList.remove("is-open");
  wishDelivery.setAttribute("aria-hidden", "true");
}
closeDelivery.addEventListener("click", hideDelivery);
wishDelivery.addEventListener("click", (event) => {
  if (event.target === wishDelivery) hideDelivery();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") { hideMemory(); hideDelivery(); hideBouquetPopup(); }
});


// HALAMAN 4: labirin landak, popup pilihan, lalu hadiah.
const giftSlide = document.getElementById("giftSlide");
const openGiftChoice = document.getElementById("openGiftChoice");
const giftChoiceModal = document.getElementById("giftChoiceModal");
const closeGiftChoice = document.getElementById("closeGiftChoice");
const giftPromptModal = document.getElementById("giftPromptModal");
const closeGiftPrompt = document.getElementById("closeGiftPrompt");
const acceptGift = document.getElementById("acceptGift");
const declineGift = document.getElementById("declineGift");
const giftNoModal = document.getElementById("giftNoModal");
const closeGiftNo = document.getElementById("closeGiftNo");
const returnGift = document.getElementById("returnGift");
const keepGiftClosed = document.getElementById("keepGiftClosed");
const giftOpenModal = document.getElementById("giftOpenModal");
const closeGiftOpen = document.getElementById("closeGiftOpen");
const giftOpenNext = document.getElementById("giftOpenNext");
const confessionModal = document.getElementById("confessionModal");
const closeConfession = document.getElementById("closeConfession");
const confessionYes = document.getElementById("confessionYes");
const confessionLater = document.getElementById("confessionLater");
const confessionFeedback = document.getElementById("confessionFeedback");
const confessionChoices = document.getElementById("confessionChoices");
const confessionContinue = document.getElementById("confessionContinue");
const confessionNext = document.getElementById("confessionNext");
let acceptGiftClicks = 0;
const giftMazeBoard = document.getElementById("giftMazeBoard");
const mazeHint = document.getElementById("mazeHint");

const mazePath = [
  // Kotak terbuka sesuai posisi pada sketsa pengguna (baris demi baris).
  [5,0],[6,0],[7,0],
  [5,1],[7,1],[8,1],[9,1],[10,1],[11,1],
  [5,2],[6,2],[7,2],[10,2],
  [5,3],[10,3],[11,3],[12,3],[13,3],
  [2,4],[3,4],[4,4],[5,4],[10,4],[11,4],
  [2,5],[5,5],[10,5],[11,5],
  [0,6],[1,6],[2,6],[5,6],[6,6],[7,6],[8,6],[10,6],
  [2,7],[3,7],[5,7],[9,7],[10,7],
  [3,8],[5,8],[9,8],[10,8],
  [3,9],[4,9],[6,9],[7,9],[8,9]
];
const mazeBlocked = [[11,2],[7,5],[8,5],[8,7],[4,8],[5,9]];
const mazeColumns = 14;
const mazeRows = 10;
const mazePathSet = new Set(mazePath.map(([x,y]) => `${x},${y}`));
const mazeBlockedSet = new Set(mazeBlocked.map(([x,y]) => `${x},${y}`));
const mazeStart = {x:0,y:6};
const mazeGoal = {x:13,y:3};
let hedgehogPosition = {...mazeStart};
let mazeComplete = false;

function renderGiftMaze() {
  giftMazeBoard.innerHTML = "";
  giftMazeBoard.style.gridTemplateColumns = `repeat(${mazeColumns}, minmax(0, 1fr))`;
  for (let y=0; y<mazeRows; y++) {
    for (let x=0; x<mazeColumns; x++) {
      const cell = document.createElement("span");
      cell.className = "maze-cell";
      cell.style.gridColumn = String(x + 1);
      cell.style.gridRow = String(y + 1);
      if (mazePathSet.has(`${x},${y}`)) cell.classList.add("is-path");
      if (mazeBlockedSet.has(`${x},${y}`)) {
        cell.classList.add("is-blocked"); cell.textContent = "✕";
        cell.setAttribute("aria-label", "Jalur tertutup");
      }
      if (x===mazeStart.x && y===mazeStart.y) {
        cell.classList.add("is-start");
        cell.setAttribute("aria-label", "Start");
      }
      if (x===mazeGoal.x && y===mazeGoal.y) {
        cell.classList.add("is-goal"); cell.textContent = "🎁";
        cell.setAttribute("aria-label", "Finish - hadiah");
      }
      giftMazeBoard.appendChild(cell);
    }
  }
  const hedgehog = document.createElement("span");
  hedgehog.className = "maze-hedgehog"; hedgehog.id = "mazeHedgehog";
  hedgehog.style.left = `${((hedgehogPosition.x + 0.5) / mazeColumns) * 100}%`;
  hedgehog.style.top = `${((hedgehogPosition.y + 0.5) / mazeRows) * 100}%`;
  hedgehog.innerHTML = '<img src="images/landak.png" alt="Landak kecil">';
  giftMazeBoard.appendChild(hedgehog);
}
function showGiftChoice() {
  if (giftSlide.classList.contains("is-open")) return;
  hedgehogPosition = {...mazeStart}; mazeComplete = false;
  mazeHint.textContent = "Mulai dari START dan cari jalan sampai FINISH. Tanda ✕ berarti jalan tertutup.";
  renderGiftMaze(); giftChoiceModal.classList.add("is-open");
  giftChoiceModal.setAttribute("aria-hidden", "false");
}
function hideGiftChoice() { giftChoiceModal.classList.remove("is-open"); giftChoiceModal.setAttribute("aria-hidden", "true"); }
function showModal(modal) { modal.classList.add("is-open"); modal.setAttribute("aria-hidden", "false"); syncLoveHearts(); }
function hideModal(modal) { modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true"); syncLoveHearts(); }
function revealGift() { showModal(giftOpenModal); openGiftChoice.setAttribute("aria-label", "Kotak hadiah sudah ditemukan"); }
let loveLayer = null;
let loveTimer = null;
function addFloatingLove() {
  if (!loveLayer) return;
  const symbols = ["♡", "♥", "❤", "✧", "ღ"];
  const heart = document.createElement("span");
  heart.className = "love-firework-piece";
  heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  heart.style.left = `${4 + Math.random() * 92}%`;
  heart.style.setProperty("--drift", `${(Math.random() - 0.5) * 90}px`);
  heart.style.setProperty("--size", `${15 + Math.random() * 23}px`);
  heart.style.setProperty("--duration", `${5.8 + Math.random() * 2.2}s`);
  loveLayer.appendChild(heart);
  window.setTimeout(() => heart.remove(), 8500);
}
function stopLoveHearts() {
  if (loveTimer) { window.clearInterval(loveTimer); loveTimer = null; }
  if (loveLayer) { loveLayer.remove(); loveLayer = null; }
}
function syncLoveHearts() {
  const shouldFloat = giftPromptModal.classList.contains("is-open") || giftOpenModal.classList.contains("is-open");
  if (shouldFloat && !loveLayer) {
    loveLayer = document.createElement("div");
    loveLayer.className = "love-fireworks";
    loveLayer.setAttribute("aria-hidden", "true");
    document.body.appendChild(loveLayer);
    for (let i = 0; i < 12; i++) window.setTimeout(addFloatingLove, i * 180);
    loveTimer = window.setInterval(addFloatingLove, 430);
  } else if (!shouldFloat && loveLayer) {
    stopLoveHearts();
  }
}
function completeGiftMaze() {
  if (mazeComplete) return; mazeComplete = true;
  mazeHint.textContent = "Yeay! Landaknya berhasil sampai FINISH! ♡";
  const hedgehog = document.getElementById("mazeHedgehog");
  if (hedgehog) hedgehog.classList.add("maze-arrived");
  window.setTimeout(() => {
    hideGiftChoice();
    window.setTimeout(() => showModal(giftPromptModal), 500);
  }, 650);
}
function moveHedgehog(direction) {
  if (!giftChoiceModal.classList.contains("is-open") || mazeComplete) return;
  const delta = {up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[direction];
  if (!delta) return;
  const nextX = hedgehogPosition.x + delta[0], nextY = hedgehogPosition.y + delta[1];
  if (!mazePathSet.has(`${nextX},${nextY}`)) {
    mazeHint.textContent = mazeBlockedSet.has(`${nextX},${nextY}`) ? "Jalan ini tertutup tanda ✕. Coba cabang yang lain!" : "Tidak ada jalur ke arah sana. Coba arah lain ya!";
    return;
  }
  hedgehogPosition = {x:nextX,y:nextY};
  const hedgehog = document.getElementById("mazeHedgehog");
  if (hedgehog) {
    hedgehog.style.left = `${((nextX + 0.5) / mazeColumns) * 100}%`;
    hedgehog.style.top = `${((nextY + 0.5) / mazeRows) * 100}%`;
  }
  mazeHint.textContent = "Bagus! Terus ikuti jalurnya ♡";
  if (nextX===mazeGoal.x && nextY===mazeGoal.y) completeGiftMaze();
}

openGiftChoice.addEventListener("click", showGiftChoice);
closeGiftChoice.addEventListener("click", hideGiftChoice);
giftChoiceModal.addEventListener("click", (event) => { if (event.target === giftChoiceModal) hideGiftChoice(); });
giftChoiceModal.querySelectorAll("[data-move]").forEach((button) => button.addEventListener("click", () => moveHedgehog(button.dataset.move)));
document.addEventListener("keydown", (event) => {
  const directions = {ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right"};
  if (directions[event.key] && giftChoiceModal.classList.contains("is-open")) { event.preventDefault(); moveHedgehog(directions[event.key]); }
});
function resetAcceptGiftButton() {
  acceptGiftClicks = 0;
  acceptGift.style.transform = "";
  acceptGift.textContent = "Silahkan ambil ♡";
}
closeGiftPrompt.addEventListener("click", () => { resetAcceptGiftButton(); hideModal(giftPromptModal); });
giftPromptModal.addEventListener("click", (event) => { if (event.target === giftPromptModal) { resetAcceptGiftButton(); hideModal(giftPromptModal); } });
acceptGift.addEventListener("click", () => {
  acceptGiftClicks += 1;
  if (acceptGiftClicks < 3) {
    const shifts = [{x: 54, y: -22}, {x: -48, y: 18}];
    const shift = shifts[acceptGiftClicks - 1];
    acceptGift.style.transform = `translate(${shift.x}px, ${shift.y}px)`;
    acceptGift.textContent = acceptGiftClicks === 1 ? "Hehe, coba lagi ♡" : "Sekali lagi! ♡";
    return;
  }
  acceptGiftClicks = 0;
  acceptGift.style.transform = "";
  acceptGift.textContent = "Silahkan ambil ♡";
  hideModal(giftPromptModal); revealGift();
});
declineGift.addEventListener("click", () => { resetAcceptGiftButton(); hideModal(giftPromptModal); showModal(giftNoModal); });
closeGiftNo.addEventListener("click", () => hideModal(giftNoModal));
giftNoModal.addEventListener("click", (event) => { if (event.target === giftNoModal) hideModal(giftNoModal); });
returnGift.addEventListener("click", () => { hideModal(giftNoModal); showModal(giftPromptModal); });
keepGiftClosed.addEventListener("click", () => hideModal(giftNoModal));
closeGiftOpen.addEventListener("click", () => hideModal(giftOpenModal));
giftOpenModal.addEventListener("click", (event) => { if (event.target === giftOpenModal) hideModal(giftOpenModal); });
giftOpenNext.addEventListener("click", () => { hideModal(giftOpenModal); showModal(confessionModal); });
function finishConfession(message) {
  confessionFeedback.textContent = message;
  confessionChoices.hidden = true;
  confessionContinue.hidden = false;
}
// Kirim pilihan Vini ke Google Sheets, tanpa mengganggu alur popup.
async function saveConfessionAnswer(answer) {
  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ answer }),
      headers: { "Content-Type": "text/plain;charset=utf-8" }
    });
  } catch (error) {
    console.error("Jawaban Vini belum berhasil dikirim:", error);
  }
}

confessionYes.addEventListener("click", () => {
  saveConfessionAnswer("Iya, aku mau!");
  finishConfession("Makasih sudah menerima perasaanku. Aku harap kita bisa saling menjaga dan mengenal lebih baik. ♡");
});
confessionLater.addEventListener("click", () => {
  saveConfessionAnswer("Aku mau pikir dulu");
  finishConfession("Nggak apa-apa, kamu boleh mengambil waktu untuk memikirkannya. Terima kasih sudah jujur. ♡");
});
confessionNext.addEventListener("click", () => { hideModal(confessionModal); document.getElementById("slide-wish").checked = true; });
closeConfession.addEventListener("click", () => hideModal(confessionModal));
confessionModal.addEventListener("click", (event) => { if (event.target === confessionModal) hideModal(confessionModal); });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") { hideGiftChoice(); hideModal(giftPromptModal); hideModal(giftNoModal); hideModal(giftOpenModal); hideModal(confessionModal); }
});


// Popup foto: semua gambar pada halaman potongan chat dapat diperbesar.
const photoViewer = document.getElementById("photoViewer");
const photoViewerImage = document.getElementById("photoViewerImage");
const photoViewerCaption = document.getElementById("photoViewerCaption");
const closePhotoViewer = document.getElementById("closePhotoViewer");
document.querySelectorAll(".chat-memories-slide .chat-final-photo-open").forEach((photoButton) => {
  photoButton.addEventListener("click", () => {
    const image = photoButton.querySelector("img");
    if (!image) return;
    photoViewerImage.src = image.src;
    photoViewerImage.alt = image.alt || "Foto kenangan";
    // Popup halaman Conversation menampilkan foto saja, tanpa caption.
    photoViewerCaption.textContent = "";
    photoViewerCaption.hidden = true;
    photoViewer.classList.add("is-open");
    photoViewer.setAttribute("aria-hidden", "false");
  });
});
function hidePhotoViewer() {
  photoViewer.classList.remove("is-open");
  photoViewer.setAttribute("aria-hidden", "true");
  photoViewerImage.src = "";
  photoViewerCaption.hidden = false;
  photoViewerCaption.textContent = "A little memory ♡";
}
closePhotoViewer.addEventListener("click", hidePhotoViewer);
photoViewer.addEventListener("click", (event) => {
  if (event.target === photoViewer) hidePhotoViewer();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && photoViewer.classList.contains("is-open")) hidePhotoViewer();
});

// Impian Vini disimpan pada browser/perangkat yang sedang digunakan.
const viniDreamInput = document.getElementById("viniDreamInput");
const viniDreamStatus = document.getElementById("viniDreamStatus");
const VINI_DREAM_KEY = "birthdayViniDream";
if (viniDreamInput) {
  try {
    viniDreamInput.value = localStorage.getItem(VINI_DREAM_KEY) || "";
  } catch (error) {
    viniDreamStatus.textContent = "Penyimpanan lokal tidak tersedia di browser ini.";
  }
  viniDreamInput.addEventListener("input", () => {
    try {
      localStorage.setItem(VINI_DREAM_KEY, viniDreamInput.value);
      viniDreamStatus.textContent = "Impian Vini tersimpan ♡";
    } catch (error) {
      viniDreamStatus.textContent = "Tidak bisa menyimpan otomatis di browser ini.";
    }
  });
}

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzPjnE_vHBe2isyEJ53sDgqKzah4KGz7hferKHhD-lA9QbcQ3lDrEV3IFcLC7-mPHDVTA/exec";

const sendDreamButton =
  document.getElementById("sendViniDream");

sendDreamButton.addEventListener("click", async () => {
  const dream = viniDreamInput.value.trim();

  if (!dream) {
    viniDreamStatus.textContent =
      "Tulis impianmu dulu ya ♡";
    return;
  }

  sendDreamButton.disabled = true;
  sendDreamButton.textContent = "Mengirim...";

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ dream }),
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      }
    });

    viniDreamStatus.textContent =
      "Impian berhasil dikirim ♡";

    viniDreamInput.value = "";
    localStorage.removeItem("birthdayViniDream");

  } catch (error) {
    viniDreamStatus.textContent =
      "Belum berhasil mengirim. Coba lagi ya.";
  }

  sendDreamButton.disabled = false;
  sendDreamButton.textContent = "Kirim Impian ♡";
});
