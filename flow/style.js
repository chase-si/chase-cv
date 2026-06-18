import styled from 'styled-components'

import { COLOR, rem } from './tokens'

export const SiderBarContainer = styled.div`
    width: ${rem(55)};
    flex-shrink: 0;
    background: ${COLOR.bgWhite};
    border-radius: ${rem(8)};
    box-shadow: 0px 0px 7px 2px rgba(9, 55, 131, 0.06);
    padding: ${rem(8)} 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`

export const Icon = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: ${rem(5)};
    cursor: pointer;

    ${(props) => props.disabled && `
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
    `}

    &.line {
        &::after {
            content: '';
            display: block;
            width: ${rem(30)};
            height: ${rem(2)};
            background: ${COLOR.greyLightest};
            margin: ${rem(5)} auto;
        }
        margin-bottom: ${rem(3)};
    }

    > .icon {
        width: ${rem(20)};
        height: ${rem(20)};
    }

    > .text {
        font-size: ${rem(10)};
    }
`

export const EditorLayout = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-height: 480px;
`

export const FlowCanvas = styled.div`
    flex: 1;
    min-height: 480px;
    overflow: auto;
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 16px;
    box-sizing: border-box;
`
