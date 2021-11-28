package com.jonathan;

import static org.junit.Assert.assertTrue;

import org.junit.Test;


public class JonathanTests extends JonathanTestBase {
	
	@Test
	public void FindCoverPhoto() 
	{
		String url = jProp.get("MAIN_URL").asString();
		setUpPhase2("Chrome", url);
		assertTrue("Photo not found", jHomePage.fotoFound());
	}
	
	@Test
	public void blogIconURL(/*String browser, String article*/) 
	{
		String url = jProp.get("MAIN_URL").asString();
		setUpPhase2("Chrome", url);		
		assertTrue("Article not found", jHomePage.blogIconURL());
	}
	
	@Test
	public void titleIsCorrect()
	{
		String url = jProp.get("MAIN_URL").asString();
		setUpPhase2("Chrome", url);
		
		String expectedTitle = "Jonathan Solis -";
		
		assertTrue("HomePage title is not valid", jHomePage.validTitle(expectedTitle));
	}
}
