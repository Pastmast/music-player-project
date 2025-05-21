const image = document.getElementById('cover');
const title = document.getElementById('music-title');
const artist = document.getElementById('music-artist');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const progress = document.getElementById('progress');
const playerProgress = document.getElementById('player-progress');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const playBtn = document.getElementById('play');
const background = document.getElementById('bg-img');

const music = new Audio();

const songs = [
	{
		path: 'music/53_Thieves_-_southside_71128553.mp3',
		displayName: 'Southside',
		cover: 'images/fon_svet_piatna_92173_1920x1080.jpg',
		artist: '53 Thieves',
	},
	{
		path: 'music/Frank Sinatra Theme From New York, New York (Remastered 2008).mp3',
		displayName: 'From New York',
		cover: 'images/new_york_city.jpeg',
		artist: 'Frank Sinatra',
	},
	{
		path: 'music/Michael Jackson Billie Jean.mp3',
		displayName: 'Billie Jean',
		cover: 'images/wpapers_ru (michael).jpg',
		artist: 'Michael Jackson',
	},
];

let musicIndex = 0;
let isPlaying = false;

function togglePlay() {
	if (isPlaying) {
		pauseMusic();
	} else {
		playMusic();
	}
}

function playMusic() {
	isPlaying = true;
	playBtn.classList.replace('fa-play', 'fa-pause');
	playBtn.setAttribute('title', 'Пауза');
	playBtn.setAttribute('aria-label', 'Приостановить трек');
	music.play().catch((error) => {
		console.error('Ошибка воспроизведения:', error);
		alert('Не удалось воспроизвести трек. Проверьте файл или подключение.');
	});
}

function pauseMusic() {
	isPlaying = false;
	playBtn.classList.replace('fa-pause', 'fa-play');
	playBtn.setAttribute('title', 'Воспроизвести');
	playBtn.setAttribute('aria-label', 'Воспроизвести трек');
	music.pause();
}

function loadMusic(song) {
	music.src = song.path;
	title.textContent = song.displayName;
	artist.textContent = song.artist;
	image.src = song.cover;
	background.src = song.cover;
}

function changeMusic(direction) {
	musicIndex = (musicIndex + direction + songs.length) % songs.length;
	loadMusic(songs[musicIndex]);
	playMusic();
}

function updateProgressBar() {
	const { duration, currentTime } = music;
	if (isNaN(duration) || isNaN(currentTime)) {
		durationEl.textContent = '0:00';
		currentTimeEl.textContent = '0:00';
		progress.style.width = '0%';
		return;
	}
	const progressPercent = (currentTime / duration) * 100;
	progress.style.width = `${progressPercent}%`;

	const formatTime = (time) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	};
	durationEl.textContent = formatTime(duration);
	currentTimeEl.textContent = formatTime(currentTime);
}

function setProgressBar(e) {
	const width = playerProgress.clientWidth;
	const clickX = e.offsetX || e.touches[0].clientX - playerProgress.getBoundingClientRect().left;
	music.currentTime = (clickX / width) * music.duration;
}

playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', () => changeMusic(1));
prevBtn.addEventListener('click', () => changeMusic(-1));
music.addEventListener('ended', () => changeMusic(1));
music.addEventListener('timeupdate', updateProgressBar);
music.addEventListener('error', () => {
	alert('Ошибка загрузки аудиофайла. Проверьте путь к файлу.');
});
playerProgress.addEventListener('click', setProgressBar);
playerProgress.addEventListener('touchstart', setProgressBar, { passive: true });

loadMusic(songs[musicIndex]);
