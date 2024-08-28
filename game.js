// 입력 모듈
import readlineSync from 'readline-sync';


//플레이어의 스탯
function Player() { 
	this.maxHp = 10;
	this.hp = 10;
	this.coin = 4;
}

//몬스터 상세정보
function Monster() {
	this.stage=1; 
	this.name="고블린"; 
	this.maxHp=10; 
	this.hp=10; 
	this.coin=1;
} 


//상태창
function displayStatus(stage, Player, Monster) {
	console.log(`\n=전투 상황=====================\n| Stage: ${stage}\n| player HP: ${Player.hp}/${Player.maxHp} coin:${Player.coin}\n| monster:${Monster.name} HP:${Monster.hp}/${Monster.maxHp} coin:${Monster.coin}\n================================\n`);
}

//시작 화면
function displaylobby() {
	console.clear();
	console.log(`\n어떤 행동을 하시겠습니까?\n=====================\n1, 게임을 시작한다\n2, 업적을 확인한다\n3, 종료\n=====================\n1-3사이의 수를 입력한뒤 Enter를 눌러주세요`);
	const choice = readlineSync.question('');

	switch (choice) {
		case '1':
			prolog();
			break;
		case '2':
			arcive();
			break;
		case '3':
			process.exit(0);
			break;
		default:
			console.log(`올바른 입력을 해주세요`);
			handleUserInput1();
	}
}	

// 게임 시작전 프롤로그
function prolog() {
	console.clear();
	console.log('\n================================\n|이 문 너머는 || 뱀과 양의 무덤|\n|이 문 너머에 || 너의 죽음들과 |\n|이 문 너머에 || 너의 보물들이 |\n================================\n\n들어가시겠습니까? 아무키나 누르면 입장 가능합니다, \n무서우면 n키를 누르세요');

	const choice = readlineSync.question('');

	switch (choice) {
		case 'n':
			displaylobby();
			break;

		default:
			startGame();
			break;
	}
}

//전투 화면
async function startGame() { 
	console.clear();
	let stage = 1;
	let player = new Player();
	let monster = new Monster();
	while (stage <= 5) {
		await battle(stage,player,monster);
	}
}

//전투 과정
function battle(stage,player,monster) {
	let situation = `${monster.name}과 마주쳤다!`; 
	let monsterLuck = Math.floor(Math.random()*2+1);
	while (player.hp > 0) {
		console.clear();

		//몬스터 공격 로직과 -1 방지	
		if (monster.coin <= 0) {
			monster.coin = 0;
			monsterLuck = 0;
		} else {
			monsterLuck = Math.floor(Math.random()*2+1);
		}

		if (player.coin <= 0) {
			player.coin = 0;
		}

		// 전투 선택
		if (monster.hp > 0) {
			displayStatus(stage,player,monster);
			console.log(situation + `\n[선택지] 1, 공격하기 2, 방어하기 3, 휴식하기`);
			const b_choice = readlineSync.question(``);
			switch (b_choice) {

				case '1':
					// 1, 공격하기
					if (player.coin > 0) {
						if (monsterLuck == 0) {
							situation = `공격에 성공했다! `;
							monster.hp -= 2; 
							monster.coin += 2;
						} else if (monsterLuck == 1) {
							situation = `서로 맞붙었다!`;
							player.hp -= 1;
							monster.hp -= 1;
							player.coin -= 1;
							monster.coin -= 1; 
						} else if (monsterLuck == 2) {
							situation = `방어당했다!`;
							player.coin -= 2; 
							monster.coin -= 1; 
						}
					} else {
						situation = `지쳐서 움직일 수 없다!`;
						player.coin += 2; 
						if (monsterLuck == 1 || monsterLuck == 2) {
							situation = situation + ` 공격받았다!`;
							player.hp -= 1;
						}
					}
					break;

				case '2':
					// 2, 방어하기
					if (player.coin > 0) {
						if (monsterLuck == 0) {
							situation = `힘을 비축했다!`;
							player.coin += 2;
							monster.coin += 2; 
						} else if (monsterLuck == 1) {
							situation = `방어에 성공했다!`;
							player.coin -= 1; 
							monster.coin -= 2;
						} else if (monsterLuck == 2) {
							situation = `서로 방어했다`;
							player.coin -= 2;
							monster.coin -= 2; 
						}
					} else {
						situation = `지쳐서 움직일 수 없다!`;
						player.coin += 2; 
						if (monsterLuck == 1 || monsterLuck == 2) {
							situation = situation + ` 공격받았다!`;
							player.hp -=1;
						}
					}
					break;
				case '3':
					// 3, 휴식하기
					situation = `잠시 상황을 보며 휴식을 했다`;
						player.coin += 2;
						if (player.hp < player.maxHp) {
							player.hp += 2;
						} else {
							player.hp = player.maxHp;
						}
						if (monsterLuck == 1) {
							situation = situation + ` 공격받았다!`;
							player.hp -=1;
						}
					break;

				default:
					//잘못된 값 입력시
					situation = `올바른 값을 입력해주세요`;
					break;
			}
		} else {
			console.clear(); 
			console.log(`클리어! 다음층으로 내려갑니다!`);
			const choice = readlineSync.question(``);
			switch (choice) {
				default:
					stage++;	
					player.hp = player.maxHp;
					player.coin += 3;
					monster.maxHp += 5;
					monster.hp = monster.maxHp;
					break;
			}
		}
	}
	console.clear();
	console.log(`\n죽었습니다, 아무거나 누르면 돌아갑니다\n`);
	// 업적 달성
	if (arcive2 == 'X') {
		arcive2 = 'O';
		console.log(`죽음을 경험하는 업적달성!`);
	}

	if (arcive1 == 'X' && stage >= 3) {
		arcive1 = 'O';
		console.log(`3스테이지에 도달하는 업적달성!`);
	}

	const choice = readlineSync.question('');

	switch (choice) {
		default:
			displaylobby();
			break;
	}
}

//업적 화면
let arcive1 ='X';
let arcive2 ='X';
function arcive() { 
	console.clear();
	console.log(`\n업적 달성 내용입니다\n=====================\n3단계에 달성했다:${arcive1}\n죽음을 경험했다:${arcive2}\n=====================\n돌아가려면 아무키나 눌러주세요`);
	const choice = readlineSync.question('');
	
	switch (choice) {

		default:
			displaylobby();
			break;
	}
}

//게임을 시작합니다
displaylobby();
