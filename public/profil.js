const user = {
    username: "froggy",
    floor: 12,
    hp: 5,
    strength: 35,
    run: 9
};

document.getElementById("username").textContent = user.username;
document.getElementById("floor").textContent = user.floor;
document.getElementById("hp").textContent = user.hp;
document.getElementById("strength").textContent = user.strength;
document.getElementById("run").textContent = user.run;

function clamp(value, min, max) {
	if (min > max) [min, max] = [max, min];
	return Math.min(max, Math.max(min, value));
}

class HPBar {
	constructor(max = 100) {
		const container = document.createElement("div");
		container.classList.add("health-bar-container");
		container.style.setProperty("--bar-value-max", max);
		container.style.setProperty("--bar-value", max);

		const label = document.createElement("label");
		label.classList.add("health-bar-label");
		container.append(label);

		const bar = document.createElement("div");
		bar.classList.add("health-bar-value");
		container.append(bar);

		const tip = document.createElement("div");
		tip.classList.add("health-bar-tip");
		this.tipDamageAnim = tip.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: 600,
			iterations: 1
		});
		this.tipDamageAnim.cancel();
		bar.append(tip);

		this.max = max;
		this.value = max;
		this.label = label;
		this.container = container;
		this.bar = bar;
		this.tip = tip;

		this.updateBarValue();
	}

	damage(amount) {
		amount = clamp(amount, 0, this.value);
		if (amount > 0) {
			this.value -= amount;

			const dmg = document.createElement("div");
			dmg.classList.add("health-bar-damage");
			dmg.style.setProperty("--bar-value", amount);
			dmg.style.setProperty("--bar-offset", this.value);
			this.bar.after(dmg);
			const dmgAnim = dmg.animate(
				[
					{
						translate: "0 6rem",
						opacity: 0
					}
				],
				{
					duration: 600,
					iterations: 1,
					easing: "ease-in"
				}
			);
			dmgAnim.addEventListener("finish", () => {
				this.container.removeChild(dmg);
				this.updateBarValue();
			});
			dmgAnim.play();

			this.tipDamageAnim.currentTime = 0;
			this.tipDamageAnim.play();

			this.updateBarValue();
		}
	}

	heal(amount) {
		amount = clamp(amount, 0, this.max - this.value);
		if (amount > 0) {
			this.value += amount;

			this.tipDamageAnim.currentTime = 0;
			this.tipDamageAnim.play();

			this.updateBarValue();
		}
	}

	updateBarValue() {
		this.bar.classList.toggle("--damaged", this.value < this.max);
		this.container.style.setProperty("--bar-value", this.value);
		this.label.innerHTML = `${this.value} / ${this.max}`;
	}
}

const hp = new HPBar(1000);
document.body.append(hp.container);

Array.from(document.querySelectorAll(".damage-button")).forEach((element) => {
	element.addEventListener("click", () => {
		const amount =
			element.dataset.amount === "random"
				? 5 + Math.round(Math.random() * 25)
				: Number(element.dataset.amount);
		hp.damage(amount);
	});
});

Array.from(document.querySelectorAll(".heal-button")).forEach((element) => {
	element.addEventListener("click", () => {
		const amount =
			element.dataset.amount === "random"
				? 50 + Math.round(Math.random() * 50)
				: Number(element.dataset.amount);
		hp.heal(amount);
	});
});

