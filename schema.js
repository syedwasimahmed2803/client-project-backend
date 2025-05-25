// Mongoose
const ClientSchema = new Schema({
  name: { type: String, required: true },
  contacts: {
    primary: {
      name:        { type: String, required: true },
      email:       { type: String, required: true },
      designation: { type: String },
      phone:       { type: String }
    },
    secondary: {
      name:        { type: String },
      email:       { type: String },
      designation: { type: String },
      phone:       { type: String }
    }
  },
  careFee:     { type: Number }, 
  status:      { type: String, enum: ['active','inactive'], default: 'active' }
}, { timestamps: true, versionKey: false });


const HospitalSchema = new Schema({
  name:     { type: String, required: true },
  location: { type: String },
  region:   { type: String },
  contacts: {
    primary: {
      name:        { type: String },
      email:       { type: String },
      designation: { type: String },
      phone:       { type: String }
    },
    secondary: {
      name:        { type: String },
      email:       { type: String },
      designation: { type: String },
      phone:       { type: String }
    }
  },
  caseFee:     { type: Number },
  status:      { type: String, enum: ['active','inactive'], default: 'active' }
}, { timestamps: true, versionKey: false });

const CaseSchema = new Schema({
  refNumber:         { type: String, unique: true, required: true },
  patientName:       { type: String, required: true },
  companyName:       { type: String },
  insuranceReference:{ type: String },
  hospital:          { type: Types.ObjectId, ref: 'Hospital', required: true },
  assistanceDate:    { type: Date },
  serviceType:       { type: String },
  invoiceStatus:     { type: String, enum: ['received','pending'], default: 'pending' },
  myStatus:          { type: String, enum: ['received','pending'], default: 'pending' },
  remarks:           { type: String },
  hospitalAmount:    { type: Number }
}, { timestamps: true, versionKey: false });



const FinanceSchema = new Schema({
  case:            { type: Types.ObjectId, ref: 'Case', required: true, unique: true },
  client:          { type: Types.ObjectId, ref: 'Client', required: true },
  patientName:     { type: String },
  hospitalAmount:  { type: Number },
  clientFee:       { type: Number },
  issueDate:       { type: Date },
  dueDate:         { type: Date }
}, { timestamps: true, versionKey: false });


const InvoiceSchema = new Schema({
  case:            { type: Types.ObjectId, ref: 'Case', required: true },
  clientName:      { type: String },
  patientName:     { type: String },
  hospitalAmount:  { type: Number },
  clientFee:       { type: Number },
  issueDate:       { type: Date },
  dueDate:         { type: Date },
  status:          { type: String, enum: ['paid','pending','overdue'], default: 'pending' }
}, { timestamps: true, versionKey: false });
