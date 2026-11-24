/* Admin interface language (EN / VI). Translates the admin screens in place: text nodes, placeholders,
   titles, toasts and confirm dialogs. Content language (what you edit) is chosen separately in the top bar. */
(function () {
  var UI = 'en'; try { UI = localStorage.getItem('jz_admin_ui') === 'vi' ? 'vi' : 'en'; } catch (e) {}
  var V = {
    /* login & shell */
    'Site administration': 'Quản trị website', 'Sign in to manage products, company information and inquiries settings.': 'Đăng nhập để quản lý sản phẩm, thông tin công ty và cài đặt liên hệ.',
    'Password': 'Mật khẩu', 'Sign in': 'Đăng nhập', '← Back to website': '← Quay lại website', 'Admin': 'Quản trị', 'Incorrect password.': 'Sai mật khẩu.',
    'Please open the admin page over https.': 'Vui lòng mở trang quản trị qua https.',
    'Dashboard': 'Bảng điều khiển', 'Products': 'Sản phẩm', 'Company': 'Công ty', 'Page content': 'Nội dung trang', 'Contact form': 'Biểu mẫu liên hệ',
    'Publish & settings': 'Đăng & cài đặt', 'View live site ↗': 'Xem website ↗', 'Sign out': 'Đăng xuất', 'Content': 'Nội dung', 'Menu': 'Menu',
    'Content language you are editing': 'Ngôn ngữ nội dung đang chỉnh sửa', 'Unpublished changes': 'Thay đổi chưa đăng', 'Preview draft ↗': 'Xem trước bản nháp ↗',
    'Publish': 'Đăng', 'Edit product': 'Sửa sản phẩm', 'Company information': 'Thông tin công ty', 'Interface': 'Giao diện',
    /* dashboard */
    'Products on site': 'Sản phẩm trên website', 'Categories': 'Danh mục', 'Last published': 'Lần đăng gần nhất', 'Inquiry delivery': 'Cách nhận yêu cầu',
    'Email (mailto)': 'Email (mailto)', 'Form service': 'Dịch vụ biểu mẫu', 'Quick actions': 'Thao tác nhanh', '+ Add product': '+ Thêm sản phẩm',
    'Manage products': 'Quản lý sản phẩm', 'Edit company info': 'Sửa thông tin công ty', 'Shown on the website in this order': 'Hiển thị trên website theo thứ tự này',
    'Product': 'Sản phẩm', 'Category': 'Danh mục', 'Volume': 'Dung tích', 'Status': 'Trạng thái', 'Visible': 'Hiển thị', 'Hidden': 'Đang ẩn', 'View': 'Xem', 'Edit': 'Sửa',
    'Order': 'Thứ tự', 'Click to toggle': 'Nhấn để bật/tắt', 'No products yet.': 'Chưa có sản phẩm.',
    'Everything is published. The website shows the current content.': 'Mọi thay đổi đã được đăng. Website đang hiển thị nội dung hiện tại.',
    'You have unpublished changes.': 'Bạn có thay đổi chưa đăng.',
    'They are saved in this browser only. Open “Publish & settings” to put them live.': 'Các thay đổi chỉ được lưu trong trình duyệt này. Mở “Đăng & cài đặt” để đưa lên website.',
    'GitHub publishing token:': 'Token đăng GitHub:', 'connected in this browser': 'đã kết nối trong trình duyệt này', 'not set': 'chưa cài đặt',
    '(add it in Publish & settings to publish and upload images)': '(thêm trong Đăng & cài đặt để đăng và tải ảnh lên)',
    'Online payment is disabled. Product pages show an inquiry button instead of prices.': 'Thanh toán trực tuyến đã tắt. Trang sản phẩm hiển thị nút liên hệ thay cho giá.',
    /* products */
    'Each category is a menu on the website (Serum · Cream · Set). Products appear there as thumbnails; clicking one opens its detail page. When a new product launches, add it to its category here. Arrows change the order; hidden products stay here but are not shown publicly.':
      'Mỗi danh mục là một menu trên website (Serum · Kem dưỡng · Bộ sản phẩm). Sản phẩm hiển thị dưới dạng ảnh thu nhỏ; nhấn vào sẽ mở trang chi tiết. Khi có sản phẩm mới, hãy thêm vào danh mục tương ứng tại đây. Mũi tên dùng để đổi thứ tự; sản phẩm bị ẩn vẫn nằm ở đây nhưng không hiển thị công khai.',
    'Without category': 'Chưa có danh mục', 'Edit these to choose a category': 'Sửa các sản phẩm này để chọn danh mục',
    'One per line, as': 'Mỗi dòng một danh mục, theo dạng', '. Each category becomes a menu item and a thumbnail list page.': '. Mỗi danh mục sẽ trở thành một mục menu và một trang danh sách ảnh thu nhỏ.',
    'Save categories': 'Lưu danh mục',
    /* product editor */
    'Basic information': 'Thông tin cơ bản', 'Show on website': 'Hiển thị trên website', 'Product name *': 'Tên sản phẩm *', 'URL id (product.html?id=…)': 'Mã URL (product.html?id=…)',
    'Changing it changes the product page address.': 'Thay đổi mã này sẽ đổi địa chỉ trang sản phẩm.', 'Leave empty to create it from the name.': 'Để trống để tự tạo từ tên sản phẩm.',
    'Brand': 'Thương hiệu', 'Line': 'Dòng sản phẩm', 'Headline on the detail page': 'Tiêu đề trên trang chi tiết', 'One-line summary on product cards': 'Tóm tắt một dòng trên thẻ sản phẩm',
    'Summary paragraph': 'Đoạn tóm tắt', 'Badges (comma separated)': 'Nhãn (cách nhau bằng dấu phẩy)', 'Card hover image (optional)': 'Ảnh khi rê chuột trên thẻ (không bắt buộc)',
    'Specifications': 'Thông số', 'Texture': 'Kết cấu', 'Packaging': 'Bao bì', 'Origin': 'Xuất xứ', 'Function / certification': 'Chức năng / chứng nhận', 'Recommended for': 'Phù hợp với',
    'Images': 'Hình ảnh', 'First image = main image': 'Ảnh đầu tiên = ảnh chính', 'MAIN': 'CHÍNH', 'Main': 'Chính', 'Add': 'Thêm', 'Upload…': 'Tải lên…', 'Remove': 'Xóa',
    'Image path (img/…) or https:// URL': 'Đường dẫn ảnh (img/…) hoặc URL https://', 'No images yet.': 'Chưa có ảnh.',
    'Uploads go straight to the website’s image folder (GitHub token required). Recommended: square, at least 1000 px, under 500 KB (JPG/WebP).': 'Ảnh tải lên được lưu thẳng vào thư mục ảnh của website (cần token GitHub). Khuyến nghị: ảnh vuông, tối thiểu 1000 px, dưới 500 KB (JPG/WebP).',
    'Detail page content': 'Nội dung trang chi tiết', 'Detail page photos are images 2–5 above, placed between sections.': 'Ảnh trong trang chi tiết là ảnh số 2–5 ở trên, đặt xen giữa các phần.',
    'Points: title | text': 'Điểm nổi bật: tiêu đề | nội dung', 'Checklist title': 'Tiêu đề danh sách kiểm tra', 'Checklist (one per line)': 'Danh sách kiểm tra (mỗi dòng một mục)',
    'Key benefits (one per line)': 'Lợi ích chính (mỗi dòng một mục)', 'Key ingredients': 'Thành phần chính', '+ Add ingredient': '+ Thêm thành phần', 'Ingredient': 'Thành phần', 'What it does': 'Công dụng',
    'How to use (one step per line)': 'Cách dùng (mỗi dòng một bước)', 'Evidence & testing (one per line)': 'Bằng chứng & thử nghiệm (mỗi dòng một mục)',
    'Full ingredients (INCI)': 'Thành phần đầy đủ (INCI)', 'Precautions (one per line)': 'Lưu ý khi sử dụng (mỗi dòng một mục)', 'Delete': 'Xóa', 'Cancel': 'Hủy', 'Save product': 'Lưu sản phẩm',
    /* company */
    'Company name (English)': 'Tên công ty (tiếng Anh)', 'Company name (Korean)': 'Tên công ty (tiếng Hàn)', 'CEO': 'Giám đốc', 'Business registration no.': 'Mã số doanh nghiệp',
    'Founded': 'Thành lập', 'Address (English)': 'Địa chỉ', 'Mobile / telephone': 'Di động / điện thoại', 'Fax': 'Fax', 'Email': 'Email', 'Business hours': 'Giờ làm việc',
    'Brand & channels': 'Thương hiệu & kênh', 'Corporate slogan': 'Khẩu hiệu công ty', 'Product brand': 'Thương hiệu sản phẩm', 'Product brand slogan': 'Khẩu hiệu thương hiệu sản phẩm',
    'Website': 'Website', 'Instagram URL': 'URL Instagram', 'Blog URL': 'URL Blog', 'Korean online store URL': 'URL cửa hàng trực tuyến Hàn Quốc', 'Save': 'Lưu',
    /* page content */
    'Home page': 'Trang chủ', 'List fields: one item per line, fields separated by': 'Ô danh sách: mỗi dòng một mục, các trường cách nhau bằng', '. Use': '. Dùng',
    'for a line break inside a headline.': 'để xuống dòng trong tiêu đề.', 'Top notice bar (one message per line)': 'Thanh thông báo trên cùng (mỗi dòng một thông báo)',
    'Hero slides: PC image | mobile image | label | headline | text | button link | button text | 2nd link | 2nd button text | image description': 'Banner chính: ảnh PC | ảnh di động | nhãn | tiêu đề | nội dung | liên kết nút | chữ trên nút | liên kết thứ 2 | chữ trên nút thứ 2 | mô tả ảnh',
    'Brand video file': 'Tệp video thương hiệu', 'Video poster image': 'Ảnh bìa video', 'Product shown on video (id)': 'Sản phẩm hiển thị trên video (mã)', 'Video card text': 'Chữ trên thẻ video', 'Video tag': 'Nhãn video',
    'Skin concern section title': 'Tiêu đề phần vấn đề da', 'Skin concern section subtitle': 'Phụ đề phần vấn đề da',
    'Skin concern tabs: tab | label | title | text | image | link | button text': 'Tab vấn đề da: tên tab | nhãn | tiêu đề | nội dung | ảnh | liên kết | chữ trên nút',
    'Brand story title': 'Tiêu đề câu chuyện thương hiệu', 'Brand story (paragraphs)': 'Câu chuyện thương hiệu (theo đoạn)', 'Brand story chips (comma separated)': 'Nhãn câu chuyện thương hiệu (cách nhau bằng dấu phẩy)',
    'Photo gallery images (one path per line)': 'Ảnh thư viện (mỗi dòng một đường dẫn)', 'Brand page (Myrié)': 'Trang thương hiệu (Myrié)', 'Brand name': 'Tên thương hiệu', 'Slogan': 'Khẩu hiệu',
    'Top image': 'Ảnh đầu trang', 'Brand promise (quote)': 'Cam kết thương hiệu (trích dẫn)', 'Introduction (paragraphs)': 'Giới thiệu (theo đoạn)', 'Meaning of the name': 'Ý nghĩa tên gọi',
    'Care approach: step | text': 'Nguyên tắc chăm sóc: bước | nội dung', 'Care approach images (one per line, same order)': 'Ảnh nguyên tắc chăm sóc (mỗi dòng một ảnh, cùng thứ tự)',
    'Sea-Calm line text': 'Giới thiệu dòng Sea-Calm', 'Routine: step | product name | text | image | link': 'Quy trình: bước | tên sản phẩm | nội dung | ảnh | liên kết',
    'Key ingredient title': 'Tiêu đề thành phần chủ đạo', 'Key ingredient text': 'Nội dung thành phần chủ đạo', 'Recommended for (one per line)': 'Phù hợp với (mỗi dòng một mục)',
    'Values: title | text': 'Giá trị: tiêu đề | nội dung', 'FAQ page': 'Trang hỏi đáp', 'Questions: question | answer': 'Câu hỏi: câu hỏi | câu trả lời',
    'About page (company introduction)': 'Trang giới thiệu (giới thiệu công ty)', 'Blank line between paragraphs. List fields: one item per line, fields separated by': 'Để một dòng trống giữa các đoạn. Ô danh sách: mỗi dòng một mục, các trường cách nhau bằng',
    'Headline': 'Tiêu đề', 'Top image path': 'Đường dẫn ảnh đầu trang', 'Who is JAYSCOS (paragraphs)': 'JAYSCOS là ai (theo đoạn)', 'Key facts: value | label': 'Số liệu nổi bật: giá trị | mô tả',
    'History: date | title | details (separate details with ;)': 'Lịch sử: thời gian | tiêu đề | chi tiết (các chi tiết cách nhau bằng ;)', 'Philosophy title': 'Tiêu đề triết lý',
    'Philosophy image path': 'Đường dẫn ảnh triết lý', 'Philosophy & value (paragraphs)': 'Triết lý & giá trị (theo đoạn)', 'Our brand (paragraphs)': 'Thương hiệu của chúng tôi (theo đoạn)',
    'Research & formulation (paragraphs)': 'Nghiên cứu & công thức (theo đoạn)', 'Quality management': 'Quản lý chất lượng', 'Intellectual property intro': 'Giới thiệu sở hữu trí tuệ',
    'Patents: kind | title | details | description | image path': 'Bằng sáng chế: loại | tên | thông tin | mô tả | đường dẫn ảnh', 'Certifications: title | description | image path': 'Chứng nhận: tên | mô tả | đường dẫn ảnh',
    'Global business text': 'Nội dung kinh doanh quốc tế', 'MOUs: year | country | value | description | image path': 'MOU: năm | quốc gia | giá trị | mô tả | đường dẫn ảnh',
    /* contact */
    'Contact page': 'Trang liên hệ', 'Intro text': 'Đoạn giới thiệu', 'Inquiry types (one per line)': 'Loại yêu cầu (mỗi dòng một loại)', 'Inquiry delivery ': 'Cách nhận yêu cầu',
    'Without a form service, the Send button opens the visitor’s email app with the inquiry already written, addressed to the recipient below. To receive inquiries directly (no email app needed), create a free form endpoint (for example Formspree or Web3Forms) for the recipient address and paste its URL here.':
      'Khi chưa có dịch vụ biểu mẫu, nút Gửi sẽ mở ứng dụng email của khách với nội dung yêu cầu đã điền sẵn, gửi tới địa chỉ nhận bên dưới. Để nhận yêu cầu trực tiếp (không cần ứng dụng email), hãy tạo một endpoint biểu mẫu miễn phí (ví dụ Formspree hoặc Web3Forms) cho địa chỉ nhận và dán URL vào đây.',
    'Recipient email': 'Email nhận', 'Form service endpoint URL (optional)': 'URL endpoint dịch vụ biểu mẫu (không bắt buộc)',
    /* publish */
    'Publish changes': 'Đăng thay đổi', 'No unpublished changes. Publishing updates the live website in about one minute.': 'Không có thay đổi chưa đăng. Sau khi đăng, website sẽ cập nhật trong khoảng một phút.',
    'There are unpublished changes in this browser. Publishing updates the live website in about one minute.': 'Có thay đổi chưa đăng trong trình duyệt này. Sau khi đăng, website sẽ cập nhật trong khoảng một phút.',
    'Publish now': 'Đăng ngay', 'Discard draft': 'Hủy bản nháp', 'GitHub connection': 'Kết nối GitHub', 'The website is hosted on GitHub Pages. Publishing writes': 'Website được lưu trữ trên GitHub Pages. Khi đăng, hệ thống ghi tệp',
    'to the repository. Use a fine-grained personal access token limited to this repository with “Contents: Read and write”. The token is stored only in this browser.': 'vào kho lưu trữ. Hãy dùng fine-grained personal access token chỉ cho kho này với quyền “Contents: Read and write”. Token chỉ được lưu trong trình duyệt này.',
    'Repository (owner/name)': 'Kho lưu trữ (chủ sở hữu/tên)', 'Branch': 'Nhánh', 'Access token': 'Access token', 'Save connection': 'Lưu kết nối', 'Test connection': 'Kiểm tra kết nối',
    'Remove token from this browser': 'Xóa token khỏi trình duyệt này', 'Backup': 'Sao lưu', 'Download all content as a file, or restore from a backup file (restored content becomes a draft).': 'Tải toàn bộ nội dung về dưới dạng tệp, hoặc khôi phục từ tệp sao lưu (nội dung khôi phục sẽ thành bản nháp).',
    'Download backup (.json)': 'Tải bản sao lưu (.json)', 'Restore backup…': 'Khôi phục bản sao lưu…', 'Admin password': 'Mật khẩu quản trị', 'The new password takes effect after you publish.': 'Mật khẩu mới có hiệu lực sau khi đăng.',
    'New password': 'Mật khẩu mới', 'Repeat new password': 'Nhập lại mật khẩu mới', 'Change password': 'Đổi mật khẩu',
    /* VI content-mode note */
    'Tiếng Việt (Vietnamese) mode.': 'Chế độ nội dung Tiếng Việt.',
    'You are editing the Vietnamese text. Products, categories, order, visibility, images and links follow the English content — change those in English mode (top right).': 'Bạn đang chỉnh sửa nội dung tiếng Việt. Sản phẩm, danh mục, thứ tự, hiển thị, hình ảnh và liên kết theo nội dung tiếng Anh — hãy thay đổi các mục này ở chế độ English (góc trên bên phải).',
    'Edit in English mode': 'Sửa ở chế độ English',
    /* toasts & dialogs */
    'Add a GitHub access token first (Publish & settings).': 'Vui lòng thêm GitHub access token trước (Đăng & cài đặt).', 'Another product already uses this URL id.': 'Mã URL này đã được sản phẩm khác sử dụng.',
    'Image upload needs the GitHub token (Publish & settings). You can also add an image URL.': 'Tải ảnh lên cần token GitHub (Đăng & cài đặt). Bạn cũng có thể thêm URL ảnh.',
    'No changes to publish.': 'Không có thay đổi để đăng.', 'Nothing to discard.': 'Không có gì để hủy.', 'Please add at least one image.': 'Vui lòng thêm ít nhất một ảnh.',
    'Please enter a product name.': 'Vui lòng nhập tên sản phẩm.', 'Please use an image under 3 MB.': 'Vui lòng dùng ảnh dưới 3 MB.', 'Published. The live site updates in about a minute.': 'Đã đăng. Website sẽ cập nhật trong khoảng một phút.',
    'Publishing…': 'Đang đăng…', 'The passwords do not match.': 'Mật khẩu không khớp.', 'This is not a valid backup file.': 'Đây không phải tệp sao lưu hợp lệ.', 'Token removed from this browser': 'Đã xóa token khỏi trình duyệt này',
    'Uploaded. It appears on the live site about a minute after publishing.': 'Đã tải lên. Ảnh sẽ xuất hiện trên website khoảng một phút sau khi đăng.', 'Uploading image…': 'Đang tải ảnh lên…', 'Use at least 8 characters.': 'Dùng ít nhất 8 ký tự.',
    'Categories saved as draft': 'Đã lưu danh mục vào bản nháp', 'Product saved as draft': 'Đã lưu sản phẩm vào bản nháp', 'Product deleted (draft)': 'Đã xóa sản phẩm (bản nháp)',
    'Company information saved as draft': 'Đã lưu thông tin công ty vào bản nháp', 'Page content saved as draft': 'Đã lưu nội dung trang vào bản nháp', 'Contact settings saved as draft': 'Đã lưu cài đặt liên hệ vào bản nháp',
    'Connection saved': 'Đã lưu kết nối', 'Draft discarded': 'Đã hủy bản nháp', 'Backup restored as draft': 'Đã khôi phục bản sao lưu vào bản nháp', 'Password changed. Publish to apply it.': 'Đã đổi mật khẩu. Hãy đăng để áp dụng.',
    'Order changed (draft)': 'Đã đổi thứ tự (bản nháp)', 'Discard all unpublished changes?': 'Hủy tất cả thay đổi chưa đăng?'
  };
  var P = [
    [/^\/ (\d+) total$/, '/ $1 tổng'],
    [/^(\d+) products? · menu link: (.+)$/, '$1 sản phẩm · liên kết menu: $2'],
    [/^\+ Add (.+) product$/, '+ Thêm sản phẩm $1'],
    [/^Delete “(.+)”\? You can still undo this by discarding the draft before publishing\.$/, 'Xóa “$1”? Bạn vẫn có thể hoàn tác bằng cách hủy bản nháp trước khi đăng.'],
    [/^Publish failed: (.*)$/, 'Đăng thất bại: $1'], [/^Upload failed: (.*)$/, 'Tải lên thất bại: $1'],
    [/^Connected to (.+) \(write access\)$/, 'Đã kết nối với $1 (có quyền ghi)'], [/^Connected to (.+) \(read only\)$/, 'Đã kết nối với $1 (chỉ đọc)'],
    [/^Connection failed \((.*)\)$/, 'Kết nối thất bại ($1)'],
    [/^(.+) is now visible \(draft\)$/, '$1 đã được hiển thị (bản nháp)'], [/^(.+) is now hidden \(draft\)$/, '$1 đã được ẩn (bản nháp)']
  ];
  function tr(s) {
    if (UI !== 'vi' || s == null) return s;
    var raw = String(s), k = raw.trim();
    if (!k) return raw;
    var out = V[k];
    if (out == null) for (var i = 0; i < P.length; i++) if (P[i][0].test(k)) { out = k.replace(P[i][0], P[i][1]); break; }
    return out == null ? raw : raw.replace(k, out);
  }
  function translate(root) {
    if (UI !== 'vi' || !root) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n, list = [];
    while ((n = w.nextNode())) list.push(n);
    list.forEach(function (n) {
      var p = n.parentElement; if (!p || p.closest('textarea,script,style,.mono,option')) return;
      var v = tr(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v;
    });
    if (root.querySelectorAll) Array.prototype.forEach.call(root.querySelectorAll('[placeholder],[title],[aria-label]'), function (e) {
      ['placeholder', 'title', 'aria-label'].forEach(function (a) { var v = e.getAttribute(a); if (v) { var x = tr(v); if (x !== v) e.setAttribute(a, x); } });
    });
  }
  window.JZ_TR = tr;
  var nativeConfirm = window.confirm.bind(window);
  window.confirm = function (m) { return nativeConfirm(tr(m)); };

  function switcher(where) {
    var d = document.createElement('div'); d.className = 'ui-lang' + (where ? ' ' + where : '');
    d.innerHTML = '<span>' + tr('Interface') + '</span>' + ['en', 'vi'].map(function (l) { return '<a href="#" data-ui="' + l + '"' + (l === UI ? ' class="on"' : '') + '>' + (l === 'en' ? 'EN' : 'VI') + '</a>'; }).join('');
    d.addEventListener('click', function (e) {
      var a = e.target.closest('[data-ui]'); if (!a) return; e.preventDefault();
      try { localStorage.setItem('jz_admin_ui', a.getAttribute('data-ui')); } catch (x) {} location.reload();
    });
    return d;
  }
  function boot() {
    document.documentElement.setAttribute('lang', UI);
    var lb = document.querySelector('.lbox'); if (lb) lb.appendChild(switcher('in-login'));
    var sf = document.querySelector('.side-ft'); if (sf) sf.insertBefore(switcher('in-side'), sf.firstChild);
    if (UI !== 'vi') return;
    document.title = 'Quản trị | JAYSCOS Global Site';
    translate(document.body);
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        if (m.type === 'characterData') { var p = m.target.parentElement; if (p && !p.closest('textarea,script,style,.mono,option')) { var v = tr(m.target.nodeValue); if (v !== m.target.nodeValue) m.target.nodeValue = v; } return; }
        Array.prototype.forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1) translate(n); else if (n.nodeType === 3 && n.parentElement && !n.parentElement.closest('textarea,script,style,.mono,option')) { var v = tr(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; } });
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
