# Describe an animation

moveTo100_100: {
    
    actor: 'cube', // default actor | optional

    type: 'linear', // type

    absolute: { x: 100, y: 100 },

    // OR

    relative: { x: 5, y: 5 },

    delay: '1s'
}

# Describe a sequence

moveSequence: [
    'cube@moveTo100_100',
    {actor: 'cube', x: 0, y: 0}
]

# Describe a paralells sequence

nearMove: [[
    'cube@moveTo100_100',
    'ball@moveTo100_100'
]]
