import { getPositionTypes } from '@/api/user';

export const educations = {
  1: "中专及以下",
  2: "高中",
  3: "大专",
  4: "本科",
  5: "硕士",
  6: "博士"
}

export const positionTypes = async () => {
  let res = await getPositionTypes();

  const resData = res.data;
  let data = {};

  resData.forEach((item) => {
    data[item._id] = item.name;
  });

  return data;
}

// export const positionTypes = {
//   1: "后端开发",
//   2: "移动开发",
//   3: "测试",
//   4: "运维/技术支持",
//   5: "数据",
//   6: "项目管理",
//   7: "硬件开发",
//   8: "前端开发",
//   9: "高端技术职位",
//   10: "人工智能",
//   11: "软件销售支持",
//   12: "其他技术职位"
// }

export const workTypes = {
  1: "全职",
  2: "兼职"
}

export const genders = {
  1: "男",
  2: "女"
}