const classes = {
    Knight: {
        description:
            "A heavily armored frontline fighter specializing in endurance and defense. <br><span>Legend says no hit makes him budge, definitely not a Hollow Knight.</span>",
        stats: {
            hp: 50,
            str: 10,
            int: 0,
            def: 10,
            speed: 2,
            luck: 3
        }
    },

    Archer: {
        description:
            "A ranged physical damage dealer with exceptional speed and precision. Relies on mobility and positioning rather than heavy protection.",
        stats: {
            hp: 40,
            str: 8,
            int: 2,
            def: 5,
            speed: 8,
            luck: 4
        }
    },

    Wizard: {
        description:
            "A master of arcane arts capable of unleashing powerful elemental spells. High magical damage output, but physically fragile.",
        stats: {
            hp: 35,
            str: 2,
            int: 12,
            def: 3,
            speed: 4,
            luck: 5
        }
    },

    Healer: {
        description:
            "A support specialist focused on restoration and protection. Keeps allies alive through sustained healing and defensive magic.",
        stats: {
            hp: 45,
            str: 3,
            int: 10,
            def: 6,
            speed: 3,
            luck: 5
        }
    },

    Necromancer: {
        description:
            "A dark spellcaster who manipulates life and death. Utilizes curses, decay, and summoned undead to overwhelm opponents.",
        stats: {
            hp: 40,
            str: 3,
            int: 11,
            def: 5,
            speed: 3,
            luck: 4
        }
    },

    Assassin: {
        description:
            "A stealth-based melee combatant built for burst damage. Excels at striking quickly and exploiting enemy weaknesses.",
        stats: {
            hp: 35,
            str: 12,
            int: 2,
            def: 3,
            speed: 10,
            luck: 5
        }
    },

    Jester: {
        description:
            "An unpredictable trickster class blending offense and utility. Relies on chaos, misdirection, and unusually high luck.",
        stats: {
            hp: 40,
            str: 6,
            int: 6,
            def: 5,
            speed: 6,
            luck: 8
        }
    },

    Bard: {
        description:
            "A versatile support class that empowers allies and disrupts enemies through musical enchantments. Balanced stats with strong utility potential.",
        stats: {
            hp: 42,
            str: 5,
            int: 8,
            def: 5,
            speed: 5,
            luck: 7
        }
    }
};

module.exports = { classes };