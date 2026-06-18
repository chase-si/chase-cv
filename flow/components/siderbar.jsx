import React, { memo } from 'react'

import {
    enlarge,
    shrink,
    normalise,
    addStep,
    addBranch,
    expandBranch,
    delet,
    undo,
    recover
} from '../assets/icons'

import { SiderBarContainer, Icon } from '../style'
import { OPERATE_TYPE } from '../constants'

const Siderbar = ({
    handleChangeSize,
    handleClickAddStep,
    handleClickAddBranch,
    handleClickExpandBranch,
    handleClickDelete,
    iconStatus
}) => {
    return (
        <SiderBarContainer>
            <Icon
                onClick={() => handleChangeSize(OPERATE_TYPE.放大)}
            >
                <img src={enlarge} alt="放大icon" className="icon" />
                <span className="text">
                    放大
                </span>
            </Icon>
            <Icon
                onClick={() => handleChangeSize(OPERATE_TYPE.缩小)}
            >
                <img src={shrink} alt="缩小icon" className="icon" />
                <span className="text">
                    缩小
                </span>
            </Icon>
            <Icon
                className="line"
                onClick={() => handleChangeSize(OPERATE_TYPE.正常)}
            >
                <img src={normalise} alt="正常icon" className="icon" />
                <span className="text">
                    正常
                </span>
            </Icon>
            <Icon
                onClick={handleClickAddStep}
                disabled={!iconStatus.allowAddStep}
            >
                <img src={addStep} alt="放大icon" className="icon" />
                <span className="text">
                    增加顺序步
                </span>
            </Icon>
            <Icon
                onClick={handleClickAddBranch}
                disabled={!iconStatus.allowAddBranch}
            >
                <img src={addBranch} alt="增加分支icon" className="icon" />
                <span className="text">
                    增加分支
                </span>
            </Icon>
            <Icon
                className="line"
                onClick={handleClickExpandBranch}
                disabled={!iconStatus.allowExpendBranch}
            >
                <img src={expandBranch} alt="扩展分支icon" className="icon" />
                <span className="text">
                    扩展分支
                </span>
            </Icon>
            <Icon
                onClick={handleClickDelete}
                disabled={!iconStatus.allowDelete}
            >
                <img src={delet} alt="删除icon" className="icon" />
                <span className="text">
                    删除
                </span>
            </Icon>
            <Icon
                disabled={!iconStatus.allowUndo}
            >
                <img src={undo} alt="撤销icon" className="icon" />
                <span className="text">
                    撤回
                </span>
            </Icon>
            <Icon
                disabled={!iconStatus.allowRecover}
            >
                <img src={recover} alt="恢复icon" className="icon" />
                <span className="text">
                    恢复
                </span>
            </Icon>
        </SiderBarContainer>
    )
}

export default memo(Siderbar)
