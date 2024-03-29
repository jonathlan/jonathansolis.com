package com.jonathan;

import static org.junit.Assert.assertTrue;

import org.junit.Test;


public class JonathanTests extends JonathanTestBase {
	
	// Home Page
	
	@Test
	public void FindCoverPhoto() 
	{
		String url = jProp.get("MAIN_URL").asString();
		setUpPhase2("Chrome", url);
		assertTrue("Photo not found", jHomePage.fotoFound());
	}
	
	@Test
	public void relevantIconURL(/*String browser, String article*/) 
	{
		String url = jProp.get("MAIN_URL").asString();
		setUpPhase2("Chrome", url);		
		assertTrue("Article not found", jHomePage.relevantIconURL());
	}
	
	@Test
	public void titleIsCorrect()
	{
		String url = jProp.get("MAIN_URL").asString();
		setUpPhase2("Chrome", url);
		
		String expectedTitle = "Jonathan Solis";
		
		assertTrue("HomePage title is not valid", jHomePage.validTitle(expectedTitle));
	}
	
	@Test
	public void numberOfIconsIsCorrect()
	{
		String url = jProp.get("MAIN_URL").asString();
		setUpPhase2("Chrome", url);
		
		assertTrue("Number of icons in the home page is not correct.", 
				jHomePage.hasEnoughIcons(5));
	}
	
	// Blog home page
	@Test
	public void blogTitleIsCorrect()
	{
		String url = jProp.get("BLOG_URL").asString();
		setUpPhase2("Chrome", url);
		
		String expectedTitle = "Blog - Jonathan Solis";
		
		assertTrue("Blog home page title is not valid", blogPage.validTitle(expectedTitle));
	}
	
	@Test
	public void numberOfArticlesIsCorrect()
	{
		String url = jProp.get("BLOG_URL").asString();
		setUpPhase2("Chrome", url);
		
		assertTrue("Number of articles in blog's home page is not correct", 
				blogPage.hasEnoughArticles(10));
	}
	
}
