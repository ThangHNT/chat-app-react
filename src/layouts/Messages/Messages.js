import classNames from 'classnames/bind';
import styles from './Messages.module.scss';
import Message from '~/components/Message';

const cx = classNames.bind(styles);

function Messages({ receiver }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('message-item')}>
                <Message text>Hello 500 ae</Message>
            </div>
            <div className={cx('message-item')}>
                <Message receiver text>
                    chao mn nha, minh la tvm
                </Message>
            </div>
            <div className={cx('message-item')}>
                <Message receiver text>
                    CÔNG TY CỔ PHẦN MTV365 Địa chỉ: Tầng 3,số 1 Trần Nguyên Đán,Khu đô thị Định Công,Hoàng Mai,Hà Nội Vị
                    trí : LẬP TRÌNH VIÊN NODE JS 1. Mô tả công việc - Phát triển phần mềm chat giữa ứng viên và nhà
                    tuyển dụng trên nền tảng Javascrip cho website tuyển dụng. - Thực hiện code phần chat cho ứng viên
                    chat với nhà tuyển dụng, chát dạng tex + truyền nhận file + video. - Phát triển các dự án mới, tư
                    vấn giải pháp, xây dựng, thiết kế để tạo ra các sản phẩm phần mềm tối ưu, phù hợp với nhu cầu của
                    khách hàng. 2.Yêu cầu: - Ko yêu cầu kinh nghiệm,có kiến thức cơ sở về Javascrip,C++,… - Có khả năng
                    làm về ngôn ngữ lập trình nodejs, socket.io trong các dự án cá nhân hoặc thực tế - Có kiến thức về
                    Javacrips, Database, C++ 3. Quyền lợi • Lương khởi điểm: thỏa thuận • Được ăn trưa tại công ty. •
                    Được đóng bảo hiểm xã hội, y tế. • Có thưởng các ngày lễ tết. • Du lịch nghỉ dưỡng hằng năm cùng
                    công ty. • Thưởng theo KPI hàng tuần ( max 500.000 đ). 4.Thời gian làm việc: Thứ 2 - Thứ 7 • Sáng 8h
                    - 11h30 • Chiều 14h – 18h Ứng viên inbox trực tiếp để được trao đổi kỹ hơn hoặc gửi CV qua địa chỉ
                    mail: tranmai96nd@gmail.com
                </Message>
            </div>
            <div className={cx('message-item')}>
                <Message receiver text>
                    CÔNG TY CỔ PHẦN MTV365 Địa chỉ: Tầng 3,số 1 Trần Nguyên Đán,Khu đô thị Định Công,Hoàng Mai,Hà Nội Vị
                    trí : LẬP TRÌNH VIÊN NODE JS 1. Mô tả công việc - Phát triển phần mềm chat giữa ứng viên và nhà
                    tuyển dụng trên nền tảng Javascrip cho website tuyển dụng. - Thực hiện code phần chat cho ứng viên
                    chat với nhà tuyển dụng, chát dạng tex + truyền nhận file + video. - Phát triển các dự án mới, tư
                    vấn giải pháp, xây dựng, thiết kế để tạo ra các sản phẩm phần mềm tối ưu, phù hợp với nhu cầu của
                    khách hàng. 2.Yêu cầu: - Ko yêu cầu kinh nghiệm,có kiến thức cơ sở về Javascrip,C++,… - Có khả năng
                    làm về ngôn ngữ lập trình nodejs, socket.io trong các dự án cá nhân hoặc thực tế - Có kiến thức về
                    Javacrips, Database, C++ 3. Quyền lợi • Lương khởi điểm: thỏa thuận • Được ăn trưa tại công ty. •
                    Được đóng bảo hiểm xã hội, y tế. • Có thưởng các ngày lễ tết. • Du lịch nghỉ dưỡng hằng năm cùng
                    công ty. • Thưởng theo KPI hàng tuần ( max 500.000 đ). 4.Thời gian làm việc: Thứ 2 - Thứ 7 • Sáng 8h
                    - 11h30 • Chiều 14h – 18h Ứng viên inbox trực tiếp để được trao đổi kỹ hơn hoặc gửi CV qua địa chỉ
                    mail: tranmai96nd@gmail.com
                </Message>
            </div>
        </div>
    );
}

export default Messages;
