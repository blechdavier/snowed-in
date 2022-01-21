import Resource from '../../assets/Resource';

type Item = {
    name: string
    texture: Resource
    maxStackSize: number
}

const Items: {[key: string]: Item} = {
}

export{ Items }