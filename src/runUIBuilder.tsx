import { bitable, UIBuilder } from "@lark-base-open/js-sdk";
import { encode } from "./Base64.js";
const table = await bitable.base.getActiveTable();
export default async function main(uiBuilder: UIBuilder) {
  uiBuilder.form(form => ({
    formItems: [
      form.tableSelect('table', { label: '选择数据表' }),
      form.input('path', { label: '默认路径', placeholder: '小程序页面路径', defaultValue: 'pages/webview/index?url=' }),
      form.fieldSelect('field1', { label: '选择字段', sourceTable: 'table' }),
      form.fieldSelect('field2', { label: '转换完成填充字段', sourceTable: 'table' }),
    ],
    buttons: ['确认'],
  }), async ({ values }) => {
    let { field1, field2, path } = values;
    const recordIds = await table.getRecordIdList(); // 获取所有记录 id
    let contents = [];
    for (let i = 0; i < recordIds.length; i++) {
      const recordId = recordIds[i]
      const cell = await table.getCellString(field1.id, recordId);
      if (cell) {
        contents.push({
          recordId: recordId,
          fields: {
            [field2.id]: `${path}${encode(cell)}`
          }
        });
      }
    }
    const res = await table.setRecords(contents)
  });
}
