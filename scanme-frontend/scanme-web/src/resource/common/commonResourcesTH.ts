const CommonResourcesTH = {
  format_date: 'dd/mm/yyyy',
  format_momnent_date: 'DD/MM/YYYY, h:mm:ss a',

  home: 'Home',
  dashboard: 'Dashboard',
  settings: 'Settings',
  audit_trails: 'Audit Trail',
  help: 'Help',
  events_history: 'Event History',

  confirm: 'Confirm',
  create: 'Create',
  add: 'Add',
  edit: 'Edit',
  reset: 'Reset',
  search: 'Search',
  save: 'Save',
  cancel: 'Cancel',
  approve: 'Approve',
  reject: 'Reject',
  delete: 'Delete',
  select: 'Select',
  deselect: 'Deselect',
  check_all: 'Check All',
  uncheck_all: 'Uncheck All',
  yes: 'Yes',
  no: 'No',

  button_ok: 'OK',
  button_yes: 'Yes',
  button_no: 'No',
  button_home: 'Home',
  button_browse: 'Browse',
  button_test_connection: 'Test Connection',
  button_activate: 'Activate',
  button_deactivate: 'Deactivate',
  button_filter: 'Filter',
  button_show_more: 'Show more...',
  button_view: 'View',
  button_view_history: 'View History',
  button_update: 'Update',
  button_validate: 'Validate',
  button_continue: 'Continue',
  button_retry: 'Retry',
  button_skip: 'Skip',
  button_invite: 'Invite',
  button_apply: 'Apply',
  button_reject: 'Reject',
  button_delete: 'Delete',
  button_remove: 'Remove',
  button_finish: 'Finish',
  button_complete: 'Complete',
  button_close: 'Close',
  button_comment: 'Comment',
  button_post: 'Post',
  button_upload: 'Upload',
  button_download: 'Download',
  button_reorder: 'Reorder',
  button_confirm: 'Confirm',
  button_advance_search: 'Advance Search',
  button_basic_search: 'Basic Search',
  button_back: 'Back',

  msg_confirm_save: 'Are you sure you want to save?',
  msg_save_success: 'Data have been saved successfully',
  msg_approve_success: 'Data have been approved successfully',
  msg_reject_success: 'Data have been rejected successfully',
  msg_confirm_delete: 'Are you sure you want to delete?',
  msg_delete_confirm_in_list: 'Are you sure to delete {0} ?',
  msg_delete_failed: 'This item was not deleted successfully',
  msg_no_change: 'You do not change anything.',
  msg_confirm_rule: 'Do you want to skip current rule information?',

  msg_no_data_found: 'No data found.',
  msg_search_result_sequence: 'Items {0} to {1}.',
  msg_search_result_page_sequence: 'Items {0} to {1} of {2}. Page {3} of {4}.',
  page_size: 'Page Size',

  error_system_error: 'System Error.',
  error_required: '{0} is required.',
  error_invalid: 'You have inserted invalid {0}. Please try again',
  error_required_minlength: '{0} is required and {0} cannot be less than {1} characters.',
  error_minlength: '{0} cannot be less than {1} characters.',
  error_maxlength: '{0} cannot be greater than {1} characters.',
  error_min: '{0} must be greater than or equal to {1}.',
  error_max: '{0} must be smaller than or equal to {1}.',
  error_equal: '{0} must be equal to {1}.',
  error_greater: '{0} must be greater than {1}.',
  error_min_date: '{0} cannot be before {1}.',
  error_max_date: '{0} cannot be after {1}.',
  error_range: '{0} is not in the range {1} through {2}.',
  error_byte: '{0} must be a byte.',
  error_short: '{0} must be a short.',
  error_long: '{0} must be a long.',
  error_float: '{0} must be a float.',
  error_double: '{0} must be a double.',
  error_integer: '{0} must be a integer.',
  error_number: '{0} must be a number.',
  error_required_number: '{0} is required and must be a number',
  error_date: '{0} is not a valid date.',
  error_email: 'Please enter a valid email address.',
  error_required_email: '{0} is required and must be a valid email address.',
  error_required_passcode: 'Code is required. Please enter Code.',
  error_phone: 'Invalid phone number. Please include area code and full phone number.',
  error_fax: 'Invalid fax number. Please include area code and full fax number.',
  error_url: '{0} is not a valid URL.',
  error_cash: 'Please enter a valid amount money.',
  error_credit_card: '{0} is a valid credit card',
  error_port: 'Invalid Port (min. 0, max. 65535)',
  error_password: 'Your new password is invalid. The password length must be between 8 and 14 characters, and no dictionary words permitted. Also, your password must contain at least 3 out of 4 following rules: lowercase, uppercase, numerals, special characters such as !@#$%^&*(){}[].',
  error_account_number: '{0} is not a valid checking account number.',
  error_routing_number: '{0} is not a valid routing number.',

  error_item_exist: 'This {0} is already existed in the system. Please try a different one',
  error_item_not_exist: 'This {0} does not exist in the system. Please try a different one',

  error_network: 'Cannot access server. Maybe network is corrupted.',
  error_internal: 'Internal error',

  error_unauthorized: 'You have not logged in or the session was expired. Please log in.', /* use for 401 */
  error_not_found: 'Item was not found.', /* use for 404 */
  error_forbidden: 'You do not have permission for this page or for this action.', /* use for 403 */
  error_data_version: 'Data has been changed by someone. Please refresh screen and continue.',
  error_data_corrupt: 'Data has been corrupt. You cannot proceed this business.',
  error_required_id: 'You must input id.',
  error_duplicated_id: 'The id is duplicated.',
  error_duplicated: '{0} is duplicated.',

  error_permission: 'Permission error',
  error_permission_search: 'You do not permission to use this page.',
  error_permission_view: 'You do not permission to use this page.',
  error_permission_add: 'You do not have "add" permission. You are not allowed to "add".',
  error_permission_edit: 'You do not have "add" permission. You are not allowed to "edit".',
  error_permission_delete: 'You do not have "add" permission. You are not allowed to "delete".',

  error_delete_transaction_account_code: 'Can not delete the account code has transactions.',
  error_invalid_payment_rule: 'Invalid payment amount of rule',

  /**
   * Boolean
   */
  true: 'True',
  false: 'False',

  /**
   * STATUS
   *
   * status_*
   */
  status: 'Status',
  status_away: 'Away',
  status_available: 'Available',
  status_idle: 'Idle',
  status_busy: 'Busy',
  status_invisible: 'Invisible',
  status_changing: 'Set Status to',

  please_select: 'Please Select',
  /**
   * GENERAL
   */
  address: 'Address',
  street: 'Street',
  ward: 'Ward',
  district: 'District',
  city: 'City',
  county: 'County',
  prefecture: 'Prefecture',
  state: 'State',
  country: 'Country',
  postcode: 'Postal Code',

  users: 'Users',
  user: 'User',
  user_list: 'Search users',
  user_info: 'User information',
  user_type: 'User Type',

  /*
   * Authentication Service
   */
  user_id: 'User Id',
  user_name: 'Email',
  password: 'Password',

  gender: 'Gender',
  male: 'Male',
  female: 'Female',
  name: 'Name',
  email: 'Email',
  notification: 'Notification',
  first_name: 'First Name',
  last_name: 'Last Name',
  middle_name: 'Middle Name',
  display_name: 'Display Name',
  phone: 'Telephone',

  from: 'From',
  to: 'To',
  field: 'Field',
  error: 'Error',

  skills: 'Skills',
  interests: 'Interests',
  achievements: 'Achievements',

  keyword: 'Keyword',
  remark: 'Remark',
  all: 'All',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  detail: 'Detail',
  description: 'Description',
  sequence: 'No.',
  total: 'Total',

  start_date: 'Start Date',
  end_date: 'End Date',
  short_name: 'Short Name',
  action_type: 'Action Type',

  private_key: 'Private Key',

  old_data_subject: 'Old Register Data',
  new_data_subject: 'New Register Data',

  contact_name: 'Contact Name',
  contact_phone: 'Contact Telephone No',
  contact_fax: 'Contact Facsimile No',
  company_id: 'Company ID',
  company_name: 'Company Name',
  company_short_name: 'Company Short Name',

  payment_summary: 'Payment Summary',
  activation_status: 'Activation Status',
  password_delivery_method: 'Password Delivery Method',
  payment_amount_max: 'Maximum Payment Amount Per Transaction',
  mobile_phone_number: 'Mobile Phone No',
  // Account
  account_currency: 'Account Currency',
  account_number: 'Account No',
  account_name: 'Account Name',

  ctrl_status: 'Control Status',
  acted_by: 'Acted By',
  action_status: 'Action Status',
  action_date: 'Action Date',
  created_date: 'Timestamp ',
  quick_action: 'Q.Action',

  /**
   * START Common-auth
   */
  applicant_title: 'สมัคร {0}',
  applicant_subtitle: 'กรุณาตรวจสอบข้อมูล',
  account_subtitle: 'บัญชีที่จะผูกกับบริการ',
  summary_title: 'สรุปข้อมูล',
  term_title: 'ข้อตกลงและเงื่อนไข',
  success_title: 'สำเร็จ',
  error_title: 'ขออภัย',
  edit_info_title: 'แก้ไขข้อมูล',

  email_title: 'ข้อมูลอีเมล',
  occupation_title: 'ข้อมูลอาชีพเบื้องต้น',

  section_applicant_info: 'ข้อมูลผู้สมัคร',
  section_occupation_info: 'ข้อมูลอาชีพ',
  section_email_info: 'ข้อมูลอีเมล',
  section_work_address: 'สถานที่ทำงาน',
  section_account: 'บัญชีที่จะผูกกับบริการ',

  person_enName: 'ชื่อ-สกุล (อังกฤษ)',
  person_thName: 'ชื่อ-สกุล',
  person_gender: 'เพศ',
  person_dateOfBirth: 'วันเดือนปีเกิด',
  person_citizenId: 'เลขทีบัตรประชาชน',
  person_passportNo: 'เลขทีพาสปอร์ต',
  person_nationality: 'สัญชาติ',
  person_title: 'Title',
  person_image: 'Image',

  registered_address: 'ที่อยู่ตามบัตรประชาชน',
  outside_address: 'ที่อยู่ในประเทศเจ้าของสัญชาติ',
  contact_address: 'ที่อยู่ติดต่อได้',
  work_address: 'ที่อยู่สถานที่ทำงาน',

  occupation: 'อาชีพ',
  profession: 'สาขาอาชีพ',
  occupation_professionOther: 'อื่นๆ',
  occupation_income: 'รายได้ต่อเดือน',
  occupation_incomeCountry: 'ประเทศที่มาของรายได้',
  occupation_workAddressName: 'ชื่อสถานที่ทำงาน',

  address_village: 'ชื่อหมู่บ้าน',
  address_moo: 'หมู่', // moo village_no
  address_building: 'อาคารชุด',
  address_room: 'เลขที่ห้อง',
  address_floor: 'ชั้น',
  address_mailNum: 'บ้านเลขที่', // mailNum
  address_soi: 'ซอย', // alley
  address_road: 'ถนน',
  address_province: 'จังหวัด',
  address_amphur: 'เขต/อำเภอ', // amphur
  address_tumbol: 'แขวง/ตำบล',
  address_postCode: 'รหัสไปรษณีย์',
  default_registration_address: 'เหมือนที่อยู่ตามบัตรประชาชน',
  default_contact_address: 'เหมือนที่อยู่ที่ติดต่อได้',

  term_header: 'ความยินยอมเปิดเผยข้อมูลส่วนตัว',
  term_content: 'ผู้ใช้บริการตกลงยินยอมให้ธนาคารเปิดเผยข้อมูลของผู้ใช้บริการดังต่อไปนี้ ให้แก่ {1}  เพื่อวัตถุประสงค์ในการสมัครและใช้บริการ {0} โดยผู้ใช้บริการมีสิทธิขอเข้าถึง แก้ไข ไม่อนุญาตให้ประมวลผล และลบข้อมูลที่เกี่ยวกับผู้ใช้บริการ ซึ่งอยู่ในความครอบครองของ {1}  โดยติดต่อที่ [โปรดประสาน Partner เพื่อระบุชื่อหน่วยงานที่รับเรื่อง และข้อมูลในการติดต่อ เช่น เบอร์โทรศัพท์]',

  condition_header: 'ความยินยอมเพื่อการตลาด',
  condition_content: `ข้าพเจ้ายินดีให้ธนาคาร เปิดเผยข้อมูลของข้าพเจ้าที่ให้ไว้หรือมีอยู่กับธนาคาร หรือที่ธนาคารได้รับหรือเข้าถึงได้จากแหล่งอื่น ซึ่งรวมถึงแต่ไม่จำกัดเพียง ข้อมูลบัญชีเงินฝาก สินเชื่อ และธุรกรรมต่างๆ ให้แก่กลุ่มธุรกิจทางการเงินกสิกรไทย ผู้ที่ได้รับข้อมูล* และชื่ออื่นใดที่จะมีการแจ้งเพิ่มเติมให้ทราบและพิจารณาต่อไป** เพื่อวัตถุประสงค์ในการพิจารณาเสนอผลิตภัณฑ์ บริการ และข้อเสนอพิเศษอื่นให้แก่ข้าพเจ้า และยินยอมให้ผู้รับข้อมูลจากธนาคารดังกล่าวเก็บรวบรวม ใช้ และเปิดเผยข้อมูลต่อไปได้ตามวัตถุประสงค์ที่ได้แจ้งไว้ต่อธนาคาร`,
  condition_note: 'หมายเหตุ',
  condition_sub_note: `*รายชื่อผู้รับข้อมูล ได้แก่`,
  condition_note1: 'กลุ่มธุรกิจทางการเงินธนาคารกสิกรไทย (รายละเอียดสามารถดูได้จาก www.kasikornbank.com/financial-conglomerate )',
  condition_note2: `**กรณีแก้ไขเพิ่มเติมผู้รับข้อมูล: ธนาคารอาจมีการแก้ไขเพิ่มเติมรายชื่อผู้รับข้อมูล โดยธนาคารจะแจ้งรายชื่อผู้รับข้อมูลดังกล่าวให้ทราบผ่านช่องทางที่ธนาคารกำหนด หากท่านไม่ประสงค์ให้ความยินยอมเปิดเผยข้อมูลแก่ผู้รับข้อมูลเพิ่มเติม ท่านสามารถแจ้งธนาคารเพื่อเปลี่ยนแปลงความยินยอม`,
  condition_contact: 'หากท่านประสงค์ที่จะเปลี่ยนแปลงความยินยอมในการเปิดเผยข้อมูล สามารถติดต่อได้ที่ K-Contact Center โทร.02-8888888',
  condition_agree: 'ประสงค์ให้เปิดเผยข้อมูล',
  condition_disagree: 'ไม่ประสงค์ให้เปิดเผยข้อมูล',

  radio_copyRegisterAddress: 'ประสงค์ให้เปิดเผยข้อมูล',
  radio_contactAddress: 'เหมือนที่อยู่ติดต่อได้',
  radio_createNewAddress: 'ที่อยู่อื่น',

  incomeSuffix: '/เดือน',
  incomeRangSuffix: 'บาท/เดือน',
  bath: 'บาท',

  button_next: 'ต่อไป',
  button_back_to: 'กลับ {0}',
  button_cancel: 'ยกเลิก',
  button_accept: 'ยืนยัน',
  button_done: 'ตกลง',

  error_message: 'ธนาคารไม่สามารถดำเนินรายการนี้ได้<br /> กรุณาทำรายการอีกครั้งในภายหลัง<br />',

  error_mobile_10201: 'Invalid mobile number from service request.',
  error_field_10202: 'Required field(s) is(are) missing, invalid value or invalid format.',
  error_lead_10212: 'Lead Id of feed is mandatory.',
  error_feed_10212: 'Feed parameter is mandatory.',
  error_token_10212: 'tokenId of feed parameter is mandatory.',
  error_feed_404: 'Feed Not Found',
  error_profile_404: 'Profile Not Found',
  error_address_404: 'Cannot get address from temp database (REDIS).',

  modal_confirm_content: '<b>แจ้งเตือน</b><br/>คุณต้องการกลับแอปพลิเคชันต้นทางหรือไม่',
  modal_confirm_btnCancel: 'ยกเลิก',
  modal_confirm_btnAccept: 'ตกลง',

  email_note: 'หมายเหตุ: อีเมลข้างต้นใช้สำหรับสมัครบริการนี้เท่านั้น',
  /**
   * END Common-auth
   */
};

export default CommonResourcesTH;
