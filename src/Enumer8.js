const CONFIG = Symbol('CONFIG'),
	CASES = Symbol('CASES'),
	FROZEN = Symbol('FROZEN'),
	IDS = Symbol('IDS')


/**
 * @const {Config} Default Enum Configuration
 * @private
 */
const DEFAULTS = {
	type: false,
	freeze: false
}

/**
 * Enumeration Class
 * @class Enum
 */
export default class Enum {
	/**
	 * Creates an instance of Enum.
	 * @param {Config|RawTypes} [config={}]
	 * @memberof Enum
	 */
	constructor(config = {}) {
		switch (typeof config) {
			case 'object':
				this[CONFIG] = Object.assign(DEFAULTS, config)
				break

			case 'string':
				this[CONFIG] = Object.assign(DEFAULTS, {type: config})
				break

			default: throw new Error('Unknown configuration object recieved')
		}
		
		return this
	}

	/**
	 * Enumerates the case(s) passed into the function
	 * @param {...caseTypes} Case A string, array of strings, or object to enumerate
	 * @return {Enum}
	 */
	case (...Case) {
		if (this[FROZEN]) {
			console.error('Cases cannot be added after the enumeration is frozen.')
			return this
		}

		let {cases, type} = this.validateCases(Case)

		switch (type) {
			case 'array':
				cases.forEach(c => this.pushCase(c))
				break

			case 'object':
				if (!this[CONFIG].type) throw new Error('Type must be defined in initialization to use enumeration cases with raw values.')
				Object.keys(cases).forEach(c => this.pushCase(c, cases[c]))
				break

			default:
				throw new TypeError('Unknown case array returned from verification.')
		}

		return this
	}

	/**
	 * Returns the enumerated property with a specified value
	 * @param {*} value The value to find in the enumeration
	 * @returns {EnumCase}
	 */
	findVal(value) { return this.cases.find(c => c.rawValue === value) }

	/** Freezes the enumeration */
	freeze() { this[FROZEN] = true }

	/**
	 * Returns whether or not the enumeration is frozen
	 * @returns {boolean}
	 */
	isFrozen() { return this[FROZEN] }

	/**
	 * Get all enumerated values
	 * @return {Array}
	 */
	get cases() {
		this[CASES] = this[CASES] || {}
		return this[CASES]
	}

	/** Allows for the iteration of cases */
	[Symbol.iterator] = () => this.cases[Symbol.iterator]()


	/**
	 * Pushes enumeration to store
	 * @param {string} id ID for the enumeration pair
	 * @param {*} [rawValue] Optional raw value
	 * @private
	 */
	pushCase = (id, val) => {
		this.ids.push(id)
		let newCase = { id: id }
		console.log(`id: ${id}, val: ${val}, type: ${this[CONFIG].type}`)
		if (typeof val === 'undefined') newCase.rawValue = this.typeResolve(id, val, this[CONFIG].type)
		else if (typeof val !== this[CONFIG].type) throw new TypeError(`Raw value must conform to the specified type.\nRaw value: ${typeof val}, Expected: ${this[CONFIG].type}`)
		else newCase.rawValue = val

		this[id] = newCase
		this.cases[id] = newCase
	}

	/**
	 * Returns a custom rawValue if none is provided
	 * @param {string} type The type of raw value to return
	 * @param {string} id
	 * @private
	 */
	typeResolve = (id, rawValue, type) => {
		switch (typeof rawValue) {
			case 'undefined':
				switch (type) {
					case false: return id
					case 'string': return id
					case 'number': return this.ids.indexOf(id) + 1
					case 'boolean': return true
					default: throw new Error('The provided type was not found!')
				}
			case this[CONFIG].type: return rawValue
			default: throw new Error(`Raw value must conform to the specified type.\nRaw value: ${typeof rawValue}, Expected: ${this[CONFIG].type}`)
		}
	}

	/**
	 * @private
	 */
	get ids() {
		this[IDS] = this[IDS] || []
		return this[IDS]
	}

	/**
	 * @private
	 */
	validateCases = (caseArray) => {
		let cases, type
		switch (typeof caseArray[0]) {
			case 'string':
			case 'number':
			case 'boolean':
				if (caseArray.forEach(c => ['string','number','boolean'].includes(typeof c))) throw new Error('Enumer8 currently only supports string, number, and boolean values')
				cases = caseArray
				type = 'array'
				break

			case 'object':
				if (caseArray.length > 1) throw new Error('Individual values cannot be enumerated if an object/array is present')
				if (Array.isArray(caseArray[0])) {
					let verified = this.validateCases(caseArray[0])
					cases = verified.cases
					type = verified.type
				} else {
					cases = caseArray[0]
					type = 'object'
				}
				break

			default:
				throw new TypeError('Enumer8 currently only supports string, number, and boolean values')
		}

		return {cases, type}
	}

}
