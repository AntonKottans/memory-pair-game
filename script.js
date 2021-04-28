document.addEventListener("DOMContentLoaded", () => {
	let timerId = undefined

	const startTimer = () => {
		let minutes = 0
		let seconds = 0
		let timerOutput = document.querySelector(".timer")
		const increaseTimer = () => {
			seconds++
			if (seconds === 60) {
				minutes++
				seconds = 0
			}
		}
		const getFormattedTimer = () => {
			return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
		}
		timerId = setInterval(() => {
			increaseTimer()
			if (minutes === 60) timerOutput.textContent = "you lost"
			timerOutput.textContent = getFormattedTimer()
		}, 1000)
	}

	const createClickHandler = () => {
		let openned = 0
		let flipped = undefined
		return ({ target }) => {
			console.log()
			if (target.matches(".back") && target.parentNode.childElementCount === 2) {
				target.closest('*[class*="card_"]').classList.add("flip-to-face")

				setTimeout(() => {
					let currentCardContainer = target.closest('*[class*="card_"]')
					let currentCardFace = target.closest('*[class*="card_"]').children[1]

					if (!flipped) {
						flipped = { container: currentCardContainer, face: currentCardFace }
					} else {
						if (
							flipped.face.getAttribute("src").slice(9, -4) ===
							currentCardFace.getAttribute("src").slice(9, -4)
						) {
							currentCardContainer.classList.remove("flip-to-face")
							flipped.container.classList.remove("flip-to-face")
							currentCardContainer.classList.add("opened")
							flipped.container.classList.add("opened")

							flipped = undefined

							openned++
							if (openned === 6) {
								openned = 0
								stopGame("win")
							}
						} else {
							currentCardContainer.classList.remove("flip-to-face")
							flipped.container.classList.remove("flip-to-face")

							flipped = undefined
						}
					}
				}, 1000)
			}
		}
	}
	const startGame = () => {
		clearInterval(timerId)
		document.querySelectorAll(".opened").forEach((elem) => elem.classList.remove("opened"))
        setTimeout(()=>{
            let cardImageNodes = getDoubledRandomImageNodes(6)
            moveCardsIntoDOM(cardImageNodes)
            startTimer()
        },1000)
	}
	const stopGame = (result = "win") => {
		clearInterval(timerId)
		let span = document.createElement("span")
		span.classList.add("result")
		span.textContent =
			result === "win"
				? `You won! You time:${document.querySelector(".timer").textContent}`
				: "You lost!"
		document.querySelector(".body").appendChild(span)
		span.addEventListener("click", () => {
			document.querySelector(".body").removeChild(span)
		})
		let resultBanner = document.createDocumentFragment()
		resultBanner.appendChild(document.createElement("span"))
	}
	const getDoubledRandomImageNodes = (amountOfElements) => {
		if (amountOfElements <= 0) return []
		const getCardNames = (amount) => {
			let cardNames = [
				"ace_1",
				"ace_2",
				"ace_3",
				"ace_4",
				"king_1",
				"king_2",
				"king_3",
				"king_4",
				"queen_1",
				"queen_2",
				"queen_3",
				"queen_4",
			]
			let result = []
			while (result.length < amount) {
				let nameIndex = Math.floor(Math.random() * 12)
				if (!result.includes(cardNames[nameIndex])) result.push(cardNames[nameIndex])
			}
			return result
		}
		const convertNamesToNodes = (arrayOfNames) => {
			let result = []
			arrayOfNames.forEach((name, i) => {
				result.push(document.createElement("img"))
				result[result.length - 1].setAttribute("src", `./images/${name}.gif`)
				result[result.length - 1].setAttribute("id", `card_${i + 1}`)
				result[result.length - 1].classList.add("face")
			})
			return result
		}
		const doubleAndShuffle = (arr) => {
			let doubledArr = [...arr, ...arr]
			let result = []
			while (doubledArr.length > 0) {
				let randomIndex = Math.floor(Math.random() * doubledArr.length)
				result.push(doubledArr.splice(randomIndex, 1)[0])
			}
			return result
		}
		let result = new Array(amountOfElements)
		result = getCardNames(amountOfElements)
		result = doubleAndShuffle(result)
		result = convertNamesToNodes(result)

		return result
	}
	const moveCardsIntoDOM = (cards) => {
		let cardContainers = document.querySelectorAll("div.card-container")
		if (cardContainers[0].childElementCount === 1)
			cardContainers.forEach((cardContainer, i) => {
				cardContainer.insertAdjacentElement("beforeend", cards[i])
			})
		else
			cardContainers.forEach((cardContainer, i) => {
				cardContainer.replaceChild(cards[i], cardContainer.lastChild)
			})
	}
	document.querySelector("#game-button").addEventListener("click", (event) => {
		event.preventDefault()
		startGame()
	})
	document.querySelector(".field").addEventListener("click", createClickHandler())
})
