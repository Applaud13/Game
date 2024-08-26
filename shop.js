import chalk, { foregroundColorNames } from 'chalk';
import readlineSync from 'readline-sync';


// 상점 UI
function displayShop(stage, player, monster) {
    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
        chalk.yellow(`${stage} 스태이지 클리어를 축하드립니다! 아이템을 구매해주세요! (골드 5원당 이자1원이 추가됩니다.)`) +
        chalk.blueBright(
            `| 보유 골드: ${chalk.red(`${player.gold}`)} |`,
        ),
    );
    console.log(chalk.magentaBright(`=====================`));
    console.log(chalk.blue(`| 플레이어 체력:${chalk.red(`${player.Maxhp}`)}/ ${chalk.red(`${player.hp}`)} 공격력:${chalk.red(`${player.attackpower}`)} 최대마나:${chalk.red(`${player.Maxmp}`)}/마나:${chalk.red(`${player.mp}`)}|`));
}


// 아이템 가격
export class Shop {
    constructor() {
        // 아이템 가격
        this.attackup = 10;
        this.MaxHpup = 10;
        this.HPrestore = 100;
    }
}


// 아이템 구매시 효과
export const Purchase = async (stage, player, monster, shop) => {
    let logs = [];

    // 상점에서 아이템 구매
    async function PurchaseItem() {
        console.clear();
        displayShop(stage, player, monster);
        if (logs.length > 4) {
            logs.shift();
        }
        logs.forEach(log => console.log(log));
        console.log(
            chalk.green(
                `\n1.공격력 강화(${shop.attackup}원) 2.최대체력 증가(${shop.MaxHpup}원) 3.체력 회복(${shop.HPrestore}원) 9.상점 나가기.`,
            ),
        );
        const choice2 = readlineSync.question('어떤 아이템이 필요하신가요? ');
        switch (choice2) {
            // 공격력 상승 아이템 구입 (공격력 3~4 증가)
            case '1':
                if (player.gold >= shop.attackup) {
                    const tempattack = 3 + Math.floor(Math.random() * 2);
                    logs.push(chalk.green(`공격력이 ${tempattack} 상승하였습니다.`));
                    player.gold -= shop.attackup;
                    shop.attackup++;
                    player.attackpower += tempattack;
                }
                else {
                    logs.push(chalk.green(`골드가 ${shop.attackup - player.gold} 부족합니다`));
                }
                await PurchaseItem();
                break;

            // 최대체력 상승 아이템 구입(최대체력 15~20 증가)
            case '2':
                if (player.gold >= shop.MaxHpup) {
                    const temphp = 15 + Math.floor(Math.random() * 6);
                    logs.push(chalk.green(`최대체력이 ${temphp} 상승하였습니다.`));
                    player.gold -= shop.MaxHpup;
                    shop.MaxHpup++;
                    player.Maxhp += temphp;
                    player.hp += temphp;
                }
                else {
                    logs.push(chalk.green(`골드가 ${shop.MaxHpup - player.gold} 부족합니다`));
                }
                await PurchaseItem();
                break;

            // 체력회복 아이템 구입
            case '3':
                // 체력이 많이 부족한 경우
                if (player.gold >= shop.HPrestore && player.Maxhp - player.hp > 1000 / shop.MaxHpup) {
                    logs.push(chalk.green(`체력이 ${player.Maxhp - player.hp} 회복되었습니다.`));
                    player.gold -= shop.HPrestore;
                    player.hp = player.Maxhp;
                }
                // 체력이 꽤 충분한 경우
                else if (player.gold >= shop.HPrestore && player.Maxhp - player.hp <= 1000 / shop.MaxHpup) {
                    await TryRestore();
                }
                else {
                    logs.push(chalk.green(`골드가 ${shop.HPrestore - player.gold}원 부족합니다`));
                }
                await PurchaseItem();
                break;

            // 상점 나가기 (이자 획득 및 대기)
            case '9':
                player.gold = Math.floor(player.gold * 1.2);
                console.clear();
                console.log(`${chalk.bgGreen(`                             `)}`)
                console.log(`${chalk.bgBlue(`스태이지 ${stage + 1} 전투를 준비하세요!`)}`)
                console.log(`${chalk.bgGreen(`                             \n`)}`)
                let space = ``;
                for (let i = 0; i < 50; i++) {
                    const Move = `${chalk.green((` 다음 전투지로 이동중입니다${space}🥷`))}`
                    process.stdout.clearLine(0);
                    process.stdout.write(Move);
                    process.stdout.cursorTo(0);
                    space += ` `;
                    await new Promise(resolve => setTimeout(resolve, 60));
                }
                return;

            // 유효하지 않은 선택
            default:
                logs.push(chalk.green(`올바른 선택을 하세요`));
                await PurchaseItem();
        }
    }

    // 체력회복 아이템 구입 (HP 충분할 경우)
    async function TryRestore() {
        console.log(chalk.green(`최대체력이 ${player.Maxhp - player.hp} 밖에 회복되지 않습니다. 정말로 하시겠습니까?`));
        const choice = readlineSync.question('1. 강행하기   2. 취소하기');
        switch (choice) {
            // 경고문구에도 불구하고 체력회복을 강행할 경우
            case '1':
                logs.push(chalk.green(`체력이 ${player.Maxhp - player.hp} 회복되었습니다`));
                player.gold -= shop.HPrestore;
                player.hp = player.Maxhp;
                break;
            // 체력회복을 취소할 경우
            case '2':
                break;

            default:
                console.clear();
                displayShop(stage, player, monster);
                console.log(chalk.green(`올바른 선택을 하세요`));
                await TryRestore();
                break;
        }
    }

    await PurchaseItem();
};