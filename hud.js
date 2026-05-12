import * as THREE from 'three';

export function createHUD(scene) {
    const centerX = -18.8285;
    const centerY = 0;
    const centerZ = 0.014;
    const width = 6.145;
    const height = 2.458;
    const angle = 180 * Math.PI / 180 - Math.PI / 2;

    const canvas = document.createElement('canvas');
    canvas.width = 2600;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const panel = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, 0.08),
        new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide })
    );
    panel.position.set(centerX, centerY, centerZ);
    panel.rotation.y = angle;
    scene.add(panel);

    // Функция отрисовки canvas
    function draw() {
        // Фон
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 5, 15, 0.95)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Рамка
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 6;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 20;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
        ctx.shadowBlur = 0;

        // Заголовок
        ctx.fillStyle = '#00ffff';
        ctx.font = 'bold 100px Arial';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 25;
        ctx.fillText('Q A S A R', 60, 110);
        ctx.shadowBlur = 0;

        // Линия
        const grad = ctx.createLinearGradient(60, 130, 900, 130);
        grad.addColorStop(0, '#00ffff');
        grad.addColorStop(1, '#ff8800');
        ctx.fillStyle = grad;
        ctx.fillRect(60, 130, 840, 4);

        // Данные
        ctx.fillStyle = '#00ff44';
        ctx.font = 'bold 46px Arial';
        ctx.fillText('●', 80, 210);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('СТАТУС СИСТЕМЫ: АКТИВЕН', 120, 210);
        ctx.fillStyle = '#00aaff';
        ctx.fillText('●', 80, 280);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('ПАМЯТЬ: 24.5 TB', 120, 280);
        ctx.fillStyle = '#00ff44';
        ctx.fillText('●', 80, 350);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('СОЕДИНЕНИЕ: СТАБИЛЬНО', 120, 350);

        // Прогресс-бар
        ctx.fillStyle = '#001122';
        ctx.fillRect(80, 420, 900, 50);
        const grad2 = ctx.createLinearGradient(80, 0, 980, 0);
        grad2.addColorStop(0, '#00ffff');
        grad2.addColorStop(1, '#ff8800');
        ctx.fillStyle = grad2;
        ctx.fillRect(80, 420, 702, 50);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(80, 420, 900, 50);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 38px Arial';
        ctx.fillText('ЗАГРУЗКА ЯДРА: 78%', 80, 520);

        // Разделитель
        const grad3 = ctx.createLinearGradient(1050, 150, 1050, 850);
        grad3.addColorStop(0, '#00ffff');
        grad3.addColorStop(0.5, '#ff8800');
        grad3.addColorStop(1, '#00ffff');
        ctx.fillStyle = grad3;
        ctx.fillRect(1050, 150, 4, 700);

        // Проекты
        ctx.fillStyle = '#00ffff';
        ctx.font = 'bold 70px Arial';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 20;
        ctx.fillText('ПРОЕКТЫ', 1120, 200);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 42px Arial';
        ctx.fillText('ОСВОЕНИЕ МАРСА — 78%', 1120, 300);
        ctx.fillText('ЛУННАЯ РУДА — 5 432 T', 1120, 380);
        ctx.fillText('ОРБИТАЛЬНАЯ СТАНЦИЯ — 92%', 1120, 460);

        // График
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(1120, 600);
        for (let i = 0; i < 8; i++) ctx.lineTo(1120 + i * 80, 600 - Math.sin(i * 0.7) * 60);
        ctx.stroke();
        for (let i = 0; i < 8; i++) {
            const gx = 1120 + i * 80, gy = 600 - Math.sin(i * 0.7) * 60;
            ctx.fillStyle = i % 2 === 0 ? '#ff8800' : '#00ffff';
            ctx.beginPath();
            ctx.arc(gx, gy, 7, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 34px Arial';
        ctx.fillText('ЭНЕРГИЯ', 1520, 560);

        // Время — ОБНОВЛЯЕТСЯ КАЖДЫЙ КАДР
        ctx.fillStyle = '#888899';
        ctx.font = '30px Arial';
        ctx.fillText(new Date().toLocaleString('ru-RU'), canvas.width / 2 - 200, canvas.height - 40);

        // Обновляем текстуру
        texture.needsUpdate = true;
    }

    // Запускаем обновление каждый кадр
    function animate() {
        requestAnimationFrame(animate);
        draw();
    }
    animate();

    console.log('✅ HUD: часы идут в реальном времени');
}