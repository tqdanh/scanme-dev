export const autocompleteMetaKeyData = [
    {label: 'Đánh giá chất lượng mặt hàng'},
    {label: 'Kích thước'},
    {label: 'Mã lô nguyên liệu'},
    {label: 'Mã SKU'},
    {label: 'Ngày giết mổ'},
    {label: 'Ngày lấy sữa, khai thác'},
    {label: 'Ngày sơ chế'},
    {label: 'Ngày thu hoạch'},
    {label: 'Ngày vận chuyển'},
    {label: 'Ngày xuất chuồng'},
    {label: 'Nhiệt độ vận chuyển, chăm sóc, bảo quản'},
    {label: 'Phương tiện vận chuyển'},
    {label: 'Số Chứng nhận kiểm dịch'},
    {label: 'Số Chứng nhận kiểm tra chất lượng'},
    {label: 'Số Chứng nhận xuất xứ'},
    {label: 'Số vận đơn vận chuyển'},
    {label: 'Tên loại phân bón'},
    {label: 'Tên loại Vaccin'},
    {label: 'Tên người vận chuyển'},
    {label: 'Tên sản phẩm'},
    {label: 'Tên thức ăn nuôi, trồng'},
    {label: 'Thời gian nuôi, trồng'},
    {label: 'Trọng lượng thu hoạch'},
    {label: 'Tuổi của mặt hàng'}
];
export const convertMetaKeyData = (array: any[]) => {
    const labelArray = [];
    array.forEach(item => {
        labelArray.push(
            { ...item, label: item.label }
        );
    });
    return labelArray;
};
