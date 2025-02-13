import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { getOrganizationIdFromUuid } from "@/lib/utils/organizations";
import { errorResponse } from "@/app/api/_handlers/error-response";

export const GET = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      let orgId = await getOrganizationIdFromUuid(supabase, activeOrgUuid!);
      const { data: paymentDetails, error } = await supabase
        .from("payment_details")
        .select("*")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching payment details:", error);
        return errorResponse(error);
      }

      const formattedPaymentDetails = paymentDetails.map((detail: any) => ({
        id: detail.id,
        default: detail.default,
        label: detail.label,
        type: detail.type,
        details: detail.details,
        createdAt: detail.created_at,
        updatedAt: detail.updated_at,
      }));

      return NextResponse.json(formattedPaymentDetails);
    } catch (error) {
      return errorResponse(error);
    }
  },
});

export const POST = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      const body = await request.json();
      const { label, type, details, default: isDefault } = body;

      let orgId = await getOrganizationIdFromUuid(supabase, activeOrgUuid!);

      // If this payment method is set as default, unset any existing default
      if (isDefault) {
        await supabase
          .from("payment_details")
          .update({ default: false })
          .eq("org_id", orgId);
      }

      const { data: newPaymentDetail, error } = await supabase
        .from("payment_details")
        .insert({
          org_id: orgId,
          label,
          type,
          details,
          default: isDefault,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating payment detail:", error);
        return errorResponse(error);
      }

      return NextResponse.json(newPaymentDetail);
    } catch (error) {
      return errorResponse(error);
    }
  },
});

export const PUT = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      const body = await request.json();
      const { id, label, type, details, default: isDefault } = body;

      let orgId = await getOrganizationIdFromUuid(supabase, activeOrgUuid!);

      // Verify the payment detail belongs to the organization
      const { data: existingDetail } = await supabase
        .from("payment_details")
        .select("id")
        .eq("id", id)
        .eq("org_id", orgId)
        .single();

      if (!existingDetail) {
        return NextResponse.json(
          { error: "Payment detail not found" },
          { status: 404 }
        );
      }

      // If this payment method is being set as default, unset any existing default
      if (isDefault) {
        await supabase
          .from("payment_details")
          .update({ default: false })
          .eq("org_id", activeOrgUuid);
      }

      const { data: updatedPaymentDetail, error } = await supabase
        .from("payment_details")
        .update({
          label,
          type,
          details,
          default: isDefault,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating payment detail:", error);
        return NextResponse.json(
          { error: "Failed to update payment detail" },
          { status: 500 }
        );
      }

      return NextResponse.json(updatedPaymentDetail);
    } catch (error) {
      console.error("Error updating payment detail:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});

export const DELETE = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  handler: async (request, { supabaseUser, supabase, activeOrgUuid }) => {
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");
      let orgId = await getOrganizationIdFromUuid(supabase, activeOrgUuid!);

      if (!id) {
        return NextResponse.json(
          { error: "Payment detail ID is required" },
          { status: 400 }
        );
      }

      // Verify the payment detail belongs to the organization
      const { data: existingDetail } = await supabase
        .from("payment_details")
        .select("id, default")
        .eq("id", id)
        .eq("org_id", orgId)
        .single();

      if (!existingDetail) {
        return NextResponse.json(
          { error: "Payment detail not found" },
          { status: 404 }
        );
      }

      // Don't allow deletion of default payment method
      if (existingDetail.default) {
        return NextResponse.json(
          { error: "Cannot delete default payment method" },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from("payment_details")
        .delete()
        .eq("id", id)
        .eq("org_id", orgId);

      if (error) {
        console.error("Error deleting payment detail:", error);
        return NextResponse.json(
          { error: "Failed to delete payment detail" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting payment detail:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
});
