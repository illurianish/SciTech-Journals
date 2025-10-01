import { NextRequest } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const { coreInfo = {}, propertyDocuments = [] } = body as {
      coreInfo: {
        propertyNameIdentifier?: string | null;
        propertyAddress?: string | null;
        landlordName?: string | null;
        landlordAddress?: string | null;
        totalLeasableSquareFeet?: number | null;
        zoningCode?: string | null;
        easementTypes?: string[];
        numberOfSuperiorInterestHolders?: number | null;
        listOfSuperiorInterestHolders?: string | null;
      };
      propertyDocuments: { name: string; size: number }[];
    };

    // Build the PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // US Letter
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const drawText = (
      text: string,
      x: number,
      y: number,
      size = 11,
      bold = false
    ) => {
      page.drawText(text, {
        x,
        y,
        size,
        font: bold ? fontBold : font,
        color: rgb(0, 0, 0),
      });
    };

    // Header bar
    page.drawRectangle({
      x: 24,
      y: 736,
      width: 564,
      height: 22,
      color: rgb(0.08, 0.1, 0.16), // dark navy
    });
    drawText(
      "AriesView Legal Hub — Core Property Information",
      32,
      742,
      11,
      true
    );

    let y = 712;
    const line = (label: string, value: string | number | null | undefined) => {
      drawText(label, 32, y, 10, true);
      drawText(value ? String(value) : "—", 220, y, 10);
      y -= 18;
    };

    line("Property ID", params.id);
    line("Property Name / Identifier", coreInfo.propertyNameIdentifier);
    line("Property Address", coreInfo.propertyAddress);
    line("Landlord Name", coreInfo.landlordName);
    line("Landlord Address", coreInfo.landlordAddress);
    line("Total Leasable Sq Ft", coreInfo.totalLeasableSquareFeet ?? null);
    line("Zoning Code", coreInfo.zoningCode);
    line(
      "Easement Types",
      coreInfo.easementTypes && coreInfo.easementTypes.length
        ? coreInfo.easementTypes.join(", ")
        : null
    );
    line(
      "Number of Superior Interest Holders",
      coreInfo.numberOfSuperiorInterestHolders ?? null
    );

    // List of holders (wrap text)
    const drawBlock = (label: string, text: string | null | undefined) => {
      if (y < 100) {
        pdfDoc.addPage([612, 792]);
        const last = pdfDoc.getPages().length - 1;
        const p = pdfDoc.getPages()[last];
        y = 760;
        // rebind drawText for the new page
        (page as any) = p;
      }
      drawText(label, 32, y, 10, true);
      y -= 16;
      const content = text || "—";
      const words = content.split(/\s+/);
      const maxWidth = 540;
      let lineBuf = "";
      for (const w of words) {
        const test = (lineBuf ? lineBuf + " " : "") + w;
        const width = font.widthOfTextAtSize(test, 10);
        if (width > maxWidth) {
          drawText(lineBuf, 32, y, 10);
          y -= 14;
          lineBuf = w;
        } else {
          lineBuf = test;
        }
      }
      if (lineBuf) {
        drawText(lineBuf, 32, y, 10);
        y -= 18;
      }
    };

    drawBlock(
      "List of Superior Interest Holders",
      coreInfo.listOfSuperiorInterestHolders
    );

    // Document names (metadata only)
    drawText("Attached Document Names", 32, y, 10, true);
    y -= 16;
    if (!propertyDocuments.length) {
      drawText("—", 32, y, 10);
      y -= 14;
    } else {
      for (const f of propertyDocuments) {
        drawText(`${f.name} (${Math.round(f.size / 1024)} KB)`, 32, y, 10);
        y -= 14;
        if (y < 60) {
          const p = pdfDoc.addPage([612, 792]);
          (page as any) = p;
          y = 760;
        }
      }
    }

    const bytes = await pdfDoc.save();
    const filename =
      (coreInfo.propertyNameIdentifier || "legal-hub") + "-summary.pdf";

    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename.replace(
          /"/g,
          ""
        )}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message || "PDF export failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
