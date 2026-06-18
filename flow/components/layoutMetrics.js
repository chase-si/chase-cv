import {
    NODE_TYPE, RATIO, SLIT, UNIT
} from '../constants'

const getType = (data) => {
    if (Array.isArray(data)) {
        return NODE_TYPE.seq.type
    }
    return data.type
}

export const getNewY = (yParam, idx, dataArr) => {
    return yParam - dataArr
        .slice(idx)
        .map(item => getHeight(item))
        .reduce((acc, cur) => (
            acc + cur
        ), 0)
}

export const getNewX = (xParam, idx, dataArr) => {
    return xParam - dataArr
        .slice(idx)
        .map(item => getWidth(item))
        .reduce((acc, cur) => (
            acc + cur
        ), 0)
}

export const getHeight = (data) => {
    const dataType = getType(data)

    switch (dataType) {
    case NODE_TYPE.start.type:
    case NODE_TYPE.step.type:
    case NODE_TYPE.end.type:
    case NODE_TYPE.transfer.type:
        return UNIT
    case NODE_TYPE.seq.type:
        return data
            .map((item) => getHeight(item))
            .reduce((acc, cur) => acc + cur, 0)
    case NODE_TYPE.cond.type:
        return Math.max(
            ...data.steps.map((item) => getHeight(item))
        ) + 10
    case NODE_TYPE.para.type:
        return Math.max(
            ...data.steps.map((item) => getHeight(item))
        ) + 10 + (2 * SLIT)
    default:
        console.error('getHeight遇到未知类型')
        return 0
    }
}

export const getWidth = (data) => {
    const dataType = getType(data)

    switch (dataType) {
    case NODE_TYPE.end.type:
    case NODE_TYPE.start.type:
    case NODE_TYPE.transfer.type:
        return UNIT * (RATIO + 1)
    case NODE_TYPE.step.type:
        return UNIT * (RATIO + 1)
    case NODE_TYPE.seq.type:
        return Math.max(
            ...data.map((item) => getWidth(item))
        )
    case NODE_TYPE.cond.type:
        return data.steps
            .map((item) => getWidth(item))
            .reduce((acc, cur) => acc + cur, 0)
    case NODE_TYPE.para.type:
        return data.steps
            .map((item) => getWidth(item))
            .reduce((acc, cur) => acc + cur, 0)
    default:
        return 0
    }
}
