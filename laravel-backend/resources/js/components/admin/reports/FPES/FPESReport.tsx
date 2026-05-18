import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { oriBlack, reportHeader } from "../../../../assets/images";

// ─── Design Tokens (classic black-and-white print style) ─────────────────────
const BLACK = "#000000";
const DARK_GRAY = "#222222";
const MID_GRAY = "#555555";
const LIGHT_GRAY = "#F5F5F5";
const BORDER = "#BBBBBB";

const styles = StyleSheet.create({
  page: {
    padding: "36pt 44pt",
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: BLACK,
    backgroundColor: "#FFFFFF",
  },

  // ── Header ──────────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: BLACK,
  },
  reportHeader: {
    flex: 1,
  },
  oriLogo: {
    width: 90,
    marginLeft: 12,
  },

  // ── Title Block ─────────────────────────────────────────────────────────
  titleBlock: {
    marginBottom: 14,
    textAlign: "center",
  },
  titleMain: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: BLACK,
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  titleSub: {
    fontSize: 8.5,
    color: DARK_GRAY,
    letterSpacing: 0.3,
  },

  // ── Info Block ──────────────────────────────────────────────────────────
  infoCard: {
    backgroundColor: LIGHT_GRAY,
    borderRadius: 3,
    padding: "9pt 12pt",
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: BLACK,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    width: "25%",
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: DARK_GRAY,
  },
  infoValue: {
    flex: 1,
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: BLACK,
  },

  // ── Section Heading ─────────────────────────────────────────────────────
  sectionHeading: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: BLACK,
    marginBottom: 5,
    marginTop: 2,
  },
  summaryNote: {
    fontSize: 7.5,
    color: MID_GRAY,
    fontStyle: "italic",
    marginBottom: 8,
    lineHeight: 1.5,
  },

  // ── Table ───────────────────────────────────────────────────────────────
  table: {
    borderWidth: 1,
    borderColor: BLACK,
    marginBottom: 18,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: DARK_GRAY,
  },
  tableBodyRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  tableBodyRowAlt: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: LIGHT_GRAY,
  },
  tableTotalRow: {
    flexDirection: "row",
    borderTopWidth: 1.5,
    borderTopColor: BLACK,
    backgroundColor: "#EBEBEB",
  },

  colType:         { width: "35%", padding: "6pt 8pt" },
  colPoints:       { width: "15%", padding: "6pt 8pt" },
  colConfirmation: { width: "25%", padding: "6pt 8pt" },
  colComments:     { flex: 1,      padding: "6pt 8pt" },

  headerCellText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
  },
  bodyCellText: {
    fontSize: 9,
    color: BLACK,
  },
  totalCellLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: BLACK,
  },
  totalCellValue: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: BLACK,
  },

  // ── Divider ─────────────────────────────────────────────────────────────
  divider: {
    borderBottomWidth: 0.75,
    borderBottomColor: BORDER,
    marginVertical: 12,
  },

  // ── Confirmation Clause ─────────────────────────────────────────────────
  confirmClause: {
    fontSize: 8.5,
    color: DARK_GRAY,
    lineHeight: 1.6,
    fontStyle: "italic",
    marginBottom: 16,
    padding: "7pt 10pt",
    borderLeftWidth: 2,
    borderLeftColor: MID_GRAY,
    backgroundColor: LIGHT_GRAY,
  },

  // ── Signature Blocks ────────────────────────────────────────────────────
  sigSection: {
    marginBottom: 8,
  },
  sigSectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: BLACK,
    marginBottom: 10,
  },
  sigGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 30,
  },
  sigBlock: {
    flex: 1,
  },
  sigName: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: BLACK,
    textDecoration: "underline",
    marginBottom: 3,
  },
  sigLine: {
    borderBottomWidth: 1,
    borderBottomColor: BLACK,
    marginBottom: 4,
    paddingTop: 22,
  },
  sigRole: {
    fontSize: 8,
    color: DARK_GRAY,
    lineHeight: 1.4,
  },
  sigDateBlock: {
    width: "28%",
    alignItems: "center",
  },
  sigDateLine: {
    borderBottomWidth: 1,
    borderBottomColor: BLACK,
    width: "100%",
    paddingTop: 22,
    marginBottom: 4,
  },
  sigDateLabel: {
    fontSize: 8,
    color: DARK_GRAY,
    textAlign: "center",
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────
export type FPESReportProps = {
  data: {
    name: string;
    college: string;
    startDate: string;
    endDate: string;
    total_points: number;
    coordinator_name: string;
    signatory_executive_director: string;
    signatory_vice_president: string;
    researchInvolvement: {
      involvement: string;
      points: number;
      confirmation?: string;
      comments?: string;
    }[];
  };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long" });

/** Shows the name if set, otherwise a blank underline with signature room */
const SignatoryName = ({ name }: { name: string }) =>
  name?.trim() ? (
    <Text style={styles.sigName}>{name}</Text>
  ) : (
    <View style={styles.sigLine} />
  );

// ─── Component ────────────────────────────────────────────────────────────────
const FPESReport = ({ data }: FPESReportProps) => {
  const totalPoints = data.total_points || 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <View style={styles.headerRow}>
          <Image src={reportHeader} style={styles.reportHeader} />
          <Image src={oriBlack} style={styles.oriLogo} />
        </View>

        {/* ── Title ────────────────────────────────────────────────────── */}
        <View style={styles.titleBlock}>
          <Text style={styles.titleMain}>Faculty Performance Evaluation Sheet</Text>
          <Text style={styles.titleSub}>Research Involvement Summary Report</Text>
        </View>

        {/* ── Faculty Info ─────────────────────────────────────────────── */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Faculty name:</Text>
            <Text style={styles.infoValue}>{data.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Department:</Text>
            <Text style={styles.infoValue}>{data.college}</Text>
          </View>
          <View style={{ ...styles.infoRow, marginBottom: 0 }}>
            <Text style={styles.infoLabel}>Period covered:</Text>
            <Text style={styles.infoValue}>
              {fmt(data.startDate)} – {fmt(data.endDate)}
            </Text>
          </View>
        </View>

        {/* ── Summary Table ────────────────────────────────────────────── */}
        <Text style={styles.sectionHeading}>Summary of FPES Report</Text>
        <Text style={styles.summaryNote}>
          (e.g., published or unpublished research/creative works; attendance, presentation or organizer of research related activities; refereeing; adviser, statistician, panel or editor or finished students' or externally funded completed researches; patented industrial designs, utility models, inventions, or trademarks)
        </Text>

        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeaderRow}>
            <View style={styles.colType}>
              <Text style={styles.headerCellText}>Research involvement type</Text>
            </View>
            <View style={styles.colPoints}>
              <Text style={styles.headerCellText}>Points earned</Text>
            </View>
            <View style={styles.colConfirmation}>
              <Text style={styles.headerCellText}>Confirmation</Text>
            </View>
            <View style={styles.colComments}>
              <Text style={styles.headerCellText}>Comments</Text>
            </View>
          </View>

          {/* Body Rows */}
          {data.researchInvolvement.map((item, i) => (
            <View
              key={i}
              style={i % 2 === 0 ? styles.tableBodyRow : styles.tableBodyRowAlt}
            >
              <View style={styles.colType}>
                <Text style={styles.bodyCellText}>{item.involvement}</Text>
              </View>
              <View style={styles.colPoints}>
                <Text style={styles.bodyCellText}>{item.points ?? 0}</Text>
              </View>
              <View style={styles.colConfirmation}>
                <Text style={styles.bodyCellText}>{item.confirmation ?? ""}</Text>
              </View>
              <View style={styles.colComments}>
                <Text style={styles.bodyCellText}>{item.comments ?? ""}</Text>
              </View>
            </View>
          ))}

          {/* Total Row */}
          <View style={styles.tableTotalRow}>
            <View style={styles.colType}>
              <Text style={styles.totalCellLabel}>Total points</Text>
            </View>
            <View style={styles.colPoints}>
              <Text style={styles.totalCellValue}>{totalPoints}</Text>
            </View>
            <View style={styles.colConfirmation}>
              <Text style={styles.bodyCellText}></Text>
            </View>
            <View style={styles.colComments}>
              <Text style={styles.bodyCellText}></Text>
            </View>
          </View>
        </View>

        {/* ── Prepared By ──────────────────────────────────────────────── */}
        <View style={styles.sigSection}>
          <Text style={styles.sigSectionLabel}>Prepared by:</Text>
          <View style={styles.sigGrid}>
            <View style={styles.sigBlock}>
              <Text style={styles.sigName}>{data.name}</Text>
              <Text style={styles.sigRole}>Signature over Printed Name</Text>
            </View>
            <View style={styles.sigDateBlock}>
              <View style={styles.sigDateLine} />
              <Text style={styles.sigDateLabel}>Date Signed</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── Evaluated By ─────────────────────────────────────────────── */}
        <View style={styles.sigSection}>
          <Text style={styles.sigSectionLabel}>Evaluated by:</Text>

          <View style={styles.sigGrid}>
            <View style={styles.sigBlock}>
              <SignatoryName name={data.coordinator_name} />
              <Text style={styles.sigRole}>Research Innovation College Coordinator</Text>
            </View>
            <View style={styles.sigDateBlock}>
              <View style={styles.sigDateLine} />
              <Text style={styles.sigDateLabel}>Date Signed</Text>
            </View>
          </View>

          <View style={styles.sigGrid}>
            <View style={styles.sigBlock}>
              <SignatoryName name={data.signatory_executive_director} />
              <Text style={styles.sigRole}>
                Executive Director, Office of Research and Innovation
              </Text>
            </View>
            <View style={styles.sigDateBlock}>
              <View style={styles.sigDateLine} />
              <Text style={styles.sigDateLabel}>Date Signed</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── Concurred By ─────────────────────────────────────────────── */}
        <View style={styles.sigSection}>
          <Text style={styles.sigSectionLabel}>Concurred by:</Text>
          <View style={styles.sigGrid}>
            <View style={styles.sigBlock}>
              <SignatoryName name={data.signatory_vice_president} />
              <Text style={styles.sigRole}>
                Vice President, Office of Research, Innovation and Extension
              </Text>
            </View>
            <View style={styles.sigDateBlock}>
              <View style={styles.sigDateLine} />
              <Text style={styles.sigDateLabel}>Date Signed</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── Confirmation Clause ───────────────────────────────────────── */}
        <Text style={styles.confirmClause}>
          I confirm the above-stated total points and descriptive rating. I understand that these points will be used in calculating my research involvement in the FPES.
        </Text>

        {/* ── Faculty Final Signature ───────────────────────────────────── */}
        <View style={styles.sigGrid}>
          <View style={styles.sigBlock}>
            <Text style={styles.sigName}>{data.name}</Text>
            <Text style={styles.sigRole}>Signature over Printed Name</Text>
          </View>
          <View style={styles.sigDateBlock}>
            <View style={styles.sigDateLine} />
            <Text style={styles.sigDateLabel}>Date Signed</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};

export default FPESReport;