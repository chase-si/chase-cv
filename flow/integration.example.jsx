/**
 * 迁入新项目时的最小示例（复制到宿主路由即可，antd 可选）
 */
import { useState } from 'react'
import FlowEditor from './FlowEditor'
import { DEMO_DATA_EXAMPLE } from './constants'

export function SfcFlowPageExample() {
    const [flowData, setFlowData] = useState(() => JSON.parse(JSON.stringify(DEMO_DATA_EXAMPLE)))

    return (
        <div style={{ padding: 16 }}>
            <FlowEditor
                datas={flowData}
                onChange={setFlowData}
            />
        </div>
    )
}
