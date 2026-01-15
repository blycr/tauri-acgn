# API 文档

本文档记录了前端与 Tauri 后端通信的 API 接口。

## 🦀 Tauri Commands (Rust)

### `scan_library`
扫描指定目录下的资源。
- **参数**: `path: String`
- **返回**: `Result<Vec<Resource>, Error>`

### `get_resource_details`
获取资源的详细元数据。
- **参数**: `id: String`
- **返回**: `ResourceDetail`

## 🗃️ 数据库架构

### `resources` 表
存储所有识别到的资源。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT | 唯一标识 |
| title | TEXT | 标题 |
| type | TEXT | anime / manga / game / novel |
| path | TEXT | 本地文件路径 |

---

*更多接口待开发中进行补充*
